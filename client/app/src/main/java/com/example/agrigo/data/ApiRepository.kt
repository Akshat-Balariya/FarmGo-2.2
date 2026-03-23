package com.example.agrigo.data

import com.example.agrigo.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.util.concurrent.TimeUnit

/**
 * Lightweight API client used by the Compose screens.
 * When base URLs are not configured, callers can fall back to curated local data.
 */
class ApiRepository(
    private val httpClient: OkHttpClient = OkHttpClient.Builder()
        .callTimeout(40, TimeUnit.SECONDS)
        .connectTimeout(40, TimeUnit.SECONDS)
        .readTimeout(40, TimeUnit.SECONDS)
        .writeTimeout(40, TimeUnit.SECONDS)
        .build(),
    private val apiBaseUrl: String = BuildConfig.API_BASE_URL.trim().trimEnd('/'),
    private val chatApiBaseUrl: String = BuildConfig.CHAT_API_BASE_URL.trim().trimEnd('/'),
) {
    suspend fun fetchWeather(location: String): WeatherData = withContext(Dispatchers.IO) {
        val baseUrl = requireConfiguredBaseUrl(apiBaseUrl, "API_BASE_URL")
        val encoded = URLEncoder.encode(location.trim(), StandardCharsets.UTF_8.name())
        val response = executeGetWithFallback(
            baseUrl,
            listOf(
                "api/v1/current?location=$encoded",
                "current?location=$encoded",
                "api/v1/weather?location=$encoded",
                "weather?location=$encoded",
            ),
        )
        val json = JSONObject(response)
        val payload = json.optJSONObject("data") ?: json

        WeatherData(
            location = payload.optString("location", location),
            temperature = payload.optDoubleOrNull("temperature"),
            humidity = payload.optDoubleOrNull("humidity"),
            rainfall = payload.optDoubleOrNull("rainfall"),
            windSpeed = payload.optDoubleOrNull("windSpeed") ?: payload.optDoubleOrNull("wind_speed"),
            condition = payload.optString("condition").ifBlank { "Unknown" },
        )
    }

    suspend fun fetchSchemes(): List<SchemeItem> = withContext(Dispatchers.IO) {
        val baseUrl = requireConfiguredBaseUrl(apiBaseUrl, "API_BASE_URL")
        val response = executeGetWithFallback(
            baseUrl,
            listOf(
                "api/v1/schemes",
                "schemes",
            ),
        )
        val json = JSONObject(response)
        val array = json.optJSONArray("schemes") ?: json.optJSONArray("data") ?: JSONArray()

        buildList {
            for (i in 0 until array.length()) {
                val item = array.optJSONObject(i) ?: continue
                add(
                    SchemeItem(
                        name = item.optString("name").ifBlank { item.optString("title") },
                        description = item.optString("description").ifBlank { "No description available." },
                        link = item.optString("link").ifBlank { "#" },
                    ),
                )
            }
        }
    }

    suspend fun fetchMarketPrices(): List<MarketPrice> = withContext(Dispatchers.IO) {
        val baseUrl = requireConfiguredBaseUrl(apiBaseUrl, "API_BASE_URL")
        val response = executeGetWithFallback(
            baseUrl,
            listOf(
                "api/v1/market/prices",
                "market/prices",
                "market-prices",
            ),
        )
        val json = JSONObject(response)
        val array = json.optJSONArray("prices") ?: json.optJSONArray("data") ?: JSONArray()

        buildList {
            for (i in 0 until array.length()) {
                val item = array.optJSONObject(i) ?: continue
                add(
                    MarketPrice(
                        id = item.optInt("id", i + 1),
                        cropName = item.optString("cropName").ifBlank { item.optString("crop") },
                        district = item.optString("district"),
                        state = item.optString("state"),
                        modalPrice = item.optDoubleOrDefault("modalPrice"),
                        minPrice = item.optDoubleOrDefault("minPrice"),
                        maxPrice = item.optDoubleOrDefault("maxPrice"),
                        unit = item.optString("unit").ifBlank { "Quintal" },
                    ),
                )
            }
        }
    }

    suspend fun sendChatMessage(message: String): String = withContext(Dispatchers.IO) {
        val body = JSONObject().put("message", message).toString()
        runCatching {
            val response = executeChatPostWithFallback(body)
            extractChatText(response)
        }.recoverCatching { error ->
            val apiError = error as? ApiHttpException
            val errorFallback = apiError?.extractServerProvidedChatText()
            if (!errorFallback.isNullOrBlank()) {
                errorFallback
            } else {
                throw error
            }
        }.getOrElse {
            throw it
        }
    }

    suspend fun analyzeDisease(base64Image: String, mimeType: String): String = withContext(Dispatchers.IO) {
        val body = JSONObject()
            .put("message", "Analyze this crop image for disease and provide treatment guidance.")
            .put("image", base64Image)
            .put("imageMimeType", mimeType)
            .toString()

        runCatching {
            val response = executeChatPostWithFallback(body)
            extractDiseaseText(response)
        }.recoverCatching { error ->
            val apiError = error as? ApiHttpException
            val errorFallback = apiError?.extractServerProvidedDiseaseText()
            if (!errorFallback.isNullOrBlank()) {
                errorFallback
            } else {
                throw error
            }
        }.getOrElse {
            throw it
        }
    }

    private fun executeChatPostWithFallback(jsonBody: String): String {
        val candidates = listOf(chatApiBaseUrl.ifBlank { apiBaseUrl }).filter { it.isNotBlank() }.distinct()
        if (candidates.isEmpty()) {
            throw IllegalStateException("Missing CHAT_API_BASE_URL or API_BASE_URL in gradle.properties")
        }

        var lastError: Exception? = null
        for (base in candidates) {
            try {
                return executePostWithFallback(base, listOf("api/chat", "api/chat/"), jsonBody)
            } catch (error: ApiHttpException) {
                if (error.statusCode !in retryablePostFallbackStatusCodes) throw error
                lastError = error
            } catch (error: Exception) {
                lastError = error
            }
        }
        throw lastError ?: IllegalStateException("Failed to call chat API")
    }

    private fun executeGetWithFallback(baseUrl: String, paths: List<String>): String {
        var lastError: Exception? = null
        for (path in paths) {
            try {
                return executeGet(joinUrl(baseUrl, path))
            } catch (error: ApiHttpException) {
                if (error.statusCode != 404) throw error
                lastError = error
            }
        }
        throw lastError ?: IllegalStateException("No endpoint paths provided")
    }

    private fun executePostWithFallback(baseUrl: String, paths: List<String>, jsonBody: String): String {
        var lastError: Exception? = null
        for (path in paths) {
            try {
                return executePost(joinUrl(baseUrl, path), jsonBody)
            } catch (error: ApiHttpException) {
                if (error.statusCode !in retryablePostFallbackStatusCodes) throw error
                lastError = error
            }
        }
        throw lastError ?: IllegalStateException("No endpoint paths provided")
    }

    private fun joinUrl(baseUrl: String, path: String): String {
        return "${baseUrl.trimEnd('/')}/${path.trimStart('/')}"
    }

    private fun executeGet(url: String): String {
        val request = Request.Builder().url(url).get().build()
        return execute(request)
    }

    private fun executePost(url: String, jsonBody: String): String {
        val requestBody = jsonBody.toRequestBody("application/json; charset=utf-8".toMediaType())
        val request = Request.Builder().url(url).post(requestBody).build()
        return execute(request)
    }

    private fun execute(request: Request): String {
        val response = httpClient.newCall(request).execute()
        val responseBody = response.body?.string().orEmpty()
        if (!response.isSuccessful) {
            throw ApiHttpException(response.code, request.url.toString(), responseBody)
        }
        return responseBody
    }

    private fun requireConfiguredBaseUrl(value: String, key: String): String {
        if (value.isBlank()) {
            throw IllegalStateException("Missing $key in gradle.properties")
        }
        return value
    }
}

private class ApiHttpException(
    val statusCode: Int,
    val requestUrl: String,
    val responseBody: String,
) : IllegalStateException("API request failed with status $statusCode for $requestUrl")

private val retryablePostFallbackStatusCodes = setOf(
    301,
    302,
    307,
    308,
    404,
)

private fun ApiHttpException.extractServerProvidedChatText(): String? {
    if (statusCode !in 500..599 || responseBody.isBlank()) return null
    return runCatching { extractChatText(responseBody) }.getOrNull()
}

private fun ApiHttpException.extractServerProvidedDiseaseText(): String? {
    if (statusCode !in 500..599 || responseBody.isBlank()) return null
    return runCatching { extractDiseaseText(responseBody) }.getOrNull()
}

private fun extractChatText(responseBody: String): String {
    val json = JSONObject(responseBody)
    return json.optString("reply")
        .ifBlank { json.optString("response") }
        .ifBlank { "I received your message, but no reply text was returned." }
}

private fun extractDiseaseText(responseBody: String): String {
    val json = JSONObject(responseBody)
    return json.optString("analysis")
        .ifBlank { json.optString("reply") }
        .ifBlank { json.optString("result") }
        .ifBlank { "Analysis completed, but the response did not include a summary." }
}

data class WeatherData(
    val location: String,
    val temperature: Double?,
    val humidity: Double?,
    val rainfall: Double?,
    val windSpeed: Double?,
    val condition: String,
)

data class SchemeItem(
    val name: String,
    val description: String,
    val link: String,
)

data class MarketPrice(
    val id: Int,
    val cropName: String,
    val district: String,
    val state: String,
    val modalPrice: Double,
    val minPrice: Double,
    val maxPrice: Double,
    val unit: String,
)

private fun JSONObject.optDoubleOrNull(key: String): Double? {
    if (!has(key) || isNull(key)) return null
    return optDouble(key)
}

private fun JSONObject.optDoubleOrDefault(key: String): Double {
    if (!has(key) || isNull(key)) return 0.0
    return optDouble(key)
}
