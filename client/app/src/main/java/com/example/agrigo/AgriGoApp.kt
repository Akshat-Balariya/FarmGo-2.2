package com.example.agrigo

import android.net.Uri
import android.util.Base64
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.agrigo.data.ApiRepository
import com.example.agrigo.data.MarketPrice
import com.example.agrigo.data.SchemeItem
import com.example.agrigo.data.WeatherData
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.util.Locale

private val primaryTabs = listOf(
    AppRoute.Home,
    AppRoute.CropMonitoring,
    AppRoute.Marketplace,
    AppRoute.Schemes,
    AppRoute.Chat,
)

private val allRoutes = listOf(
    AppRoute.Home,
    AppRoute.About,
    AppRoute.Schemes,
    AppRoute.Blog,
    AppRoute.Contact,
    AppRoute.CropMonitoring,
    AppRoute.DiseaseDetection,
    AppRoute.YieldPrediction,
    AppRoute.Marketplace,
    AppRoute.FinancialSupport,
    AppRoute.Chat,
)

enum class AppRoute(
    val route: String,
    val title: String,
    val iconResId: Int = 0,
    val bottomLabel: String = title,
) {
    Home("home", "Home", R.drawable.ic_home, "Home"),
    About("about", "About"),
    Schemes("schemes", "Schemes", R.drawable.ic_schemes, "Schemes"),
    Blog("blog", "Blog"),
    Contact("contact", "Contact"),
    CropMonitoring("crop-monitoring", "Crop Monitoring", R.drawable.ic_crop, "Crops"),
    DiseaseDetection("disease-detection", "Disease Detection"),
    YieldPrediction("yield-prediction", "Yield Prediction"),
    Marketplace("marketplace", "Marketplace", R.drawable.ic_marketplace, "Market"),
    FinancialSupport("financial-support", "Financial Support"),
    Chat("chat", "AI Chat", R.drawable.ic_chat, "Chat"),
}

data class ChatMessage(val role: String, val text: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AgriGoApp(repository: ApiRepository = ApiRepository()) {
    val navController = rememberNavController()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    val currentRoute = navController.currentBackStackEntryAsState().value?.destination?.route ?: AppRoute.Home.route
    val pageTitle = allRoutes.firstOrNull { it.route == currentRoute }?.title ?: "AgriGo"

    Scaffold(
        topBar = { CenterAlignedTopAppBar(title = { Text(pageTitle) }) },
        snackbarHost = { SnackbarHost(snackbarHostState) },
        bottomBar = {
            NavigationBar {
                primaryTabs.forEach { item ->
                    NavigationBarItem(
                        selected = currentRoute == item.route,
                        onClick = {
                            navController.navigate(item.route) {
                                popUpTo(navController.graph.startDestinationId) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = { 
                            if (item.iconResId != 0) {
                                Icon(
                                    painter = painterResource(id = item.iconResId),
                                    contentDescription = item.title,
                                    modifier = Modifier.size(24.dp)
                                )
                            } else {
                                Text(item.title.take(1))
                            }
                        },
                        label = {
                            Text(
                                text = item.bottomLabel,
                                maxLines = 1,
                                softWrap = false,
                                overflow = TextOverflow.Ellipsis,
                                textAlign = TextAlign.Center,
                            )
                        },
                    )
                }
            }
        },
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = AppRoute.Home.route,
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
        ) {
            composable(AppRoute.Home.route) { HomeScreen(navController) }
            composable(AppRoute.About.route) { InfoListScreen("About", aboutItems) }
            composable(AppRoute.Schemes.route) { SchemesScreen(repository) }
            composable(AppRoute.Blog.route) { BlogScreen() }
            composable(AppRoute.Contact.route) { ContactScreen() }
            composable(AppRoute.CropMonitoring.route) { CropMonitoringScreen(repository) }
            composable(AppRoute.DiseaseDetection.route) { DiseaseDetectionScreen(repository) }
            composable(AppRoute.YieldPrediction.route) { InfoListScreen("Yield Prediction", yieldItems) }
            composable(AppRoute.Marketplace.route) { MarketplaceScreen(repository) }
            composable(AppRoute.FinancialSupport.route) { InfoListScreen("Financial Support", financeItems) }
            composable(AppRoute.Chat.route) { ChatScreen(repository) }
        }


    }
}

@Composable
private fun HomeScreen(navController: NavHostController) {
    val features = listOf(
        "Smart crop monitoring and weather lookup",
        "Government schemes discovery",
        "Live market prices",
        "AI disease detection and farmer assistant",
    )

    val quickRoutes = listOf(
        AppRoute.CropMonitoring,
        AppRoute.DiseaseDetection,
        AppRoute.Marketplace,
        AppRoute.Chat,
        AppRoute.About,
        AppRoute.Blog,
        AppRoute.Contact,
        AppRoute.FinancialSupport,
        AppRoute.YieldPrediction,
    )

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(210.dp)
                    .clip(RoundedCornerShape(20.dp)),
            ) {
                Image(
                    painter = painterResource(id = R.drawable.hero_farm),
                    contentDescription = "Lush green farmland",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize(),
                )
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                listOf(
                                    MaterialTheme.colorScheme.primary.copy(alpha = 0.05f),
                                    MaterialTheme.colorScheme.primary.copy(alpha = 0.75f),
                                ),
                            ),
                        ),
                )
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(16.dp),
                ) {
                    Text("AI-Powered Agriculture", color = MaterialTheme.colorScheme.onPrimary)
                    Text(
                        "Empowering Farmers with Smart Technology",
                        style = MaterialTheme.typography.headlineSmall,
                        color = MaterialTheme.colorScheme.onPrimary,
                        fontWeight = FontWeight.Bold,
                    )
                }
            }
        }

        item {
            Card {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Platform Highlights", style = MaterialTheme.typography.titleMedium)
                    features.forEach { feature ->
                        Text("- $feature")
                    }
                }
            }
        }

        item {
            Text("Explore", style = MaterialTheme.typography.titleMedium)
        }

        items(quickRoutes) { route ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(route.title, fontWeight = FontWeight.SemiBold)
                        Text("Open ${route.title.lowercase(Locale.getDefault())} feature")
                    }
                    TextButton(onClick = { navController.navigate(route.route) }) {
                        Text("Open")
                    }
                }
            }
        }
    }
}

@Composable
private fun CropMonitoringScreen(repository: ApiRepository) {
    var location by rememberSaveable { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var result by remember { mutableStateOf<WeatherData?>(null) }
    var error by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Live Weather Lookup", style = MaterialTheme.typography.headlineSmall)
        Text("Matches the web flow: enter city or district and fetch live current weather.")

        OutlinedTextField(
            value = location,
            onValueChange = { location = it },
            label = { Text("Location") },
            modifier = Modifier.fillMaxWidth(),
            placeholder = { Text("Coimbatore") },
        )

        Button(
            onClick = {
                if (location.isBlank() || loading) return@Button
                loading = true
                error = null
                scope.launch {
                    runCatching { repository.fetchWeather(location) }
                        .onSuccess { result = it }
                        .onFailure {
                            result = null
                            error = it.message ?: "Failed to fetch weather"
                        }
                    loading = false
                }
            },
            enabled = !loading,
        ) {
            Text(if (loading) "Checking..." else "Check Weather")
        }

        error?.let {
            Text(it, color = MaterialTheme.colorScheme.error)
        }

        result?.let { weather ->
            val rows = listOf(
                "Location" to weather.location,
                "Temperature" to weather.temperature?.let { "${formatTwoDecimals(it)} C" }.orEmpty().ifBlank { "--" },
                "Humidity" to weather.humidity?.let { "${formatTwoDecimals(it)}%" }.orEmpty().ifBlank { "--" },
                "Rainfall" to weather.rainfall?.let { "${formatTwoDecimals(it)} mm" }.orEmpty().ifBlank { "--" },
                "Wind" to weather.windSpeed?.let { "${formatTwoDecimals(it)} m/s" }.orEmpty().ifBlank { "--" },
                "Condition" to weather.condition,
            )
            Card {
                Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    rows.forEach { (key, value) ->
                        Text("$key: $value")
                    }
                }
            }
        }
    }
}

@Composable
private fun SchemesScreen(repository: ApiRepository) {
    var schemes by remember { mutableStateOf<List<SchemeItem>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }

    val fallback = listOf(
        SchemeItem("PM-KISAN", "Direct income support for farmer families.", "#"),
        SchemeItem("Fasal Bima Yojana", "Crop insurance against natural calamities.", "#"),
        SchemeItem("Kisan Credit Card", "Affordable credit for crop production.", "#"),
    )

    LaunchedEffect(Unit) {
        runCatching { repository.fetchSchemes() }
            .onSuccess { schemes = it }
            .onFailure { error = it.message }
        loading = false
    }

    val displaySchemes = if (schemes.isNotEmpty()) schemes.take(12) else fallback

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Text("Farmer Schemes", style = MaterialTheme.typography.headlineSmall)
        }
        if (loading) item { Text("Loading live schemes...") }
        if (!error.isNullOrBlank()) item { Text("$error. Showing curated schemes.", color = MaterialTheme.colorScheme.error) }
        items(displaySchemes) { scheme ->
            Card {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(scheme.name, fontWeight = FontWeight.SemiBold)
                    Text(scheme.description)
                    Text("Link: ${scheme.link}", style = MaterialTheme.typography.bodySmall)
                }
            }
        }
    }
}

@Composable
private fun MarketplaceScreen(repository: ApiRepository) {
    var prices by remember { mutableStateOf<List<MarketPrice>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    var search by rememberSaveable { mutableStateOf("") }

    val fallback = listOf(
        MarketPrice(1, "Organic Wheat", "Pune", "Maharashtra", 2300.0, 2100.0, 2500.0, "Quintal"),
        MarketPrice(2, "Basmati Rice", "Karnal", "Haryana", 5200.0, 5000.0, 5600.0, "Quintal"),
        MarketPrice(3, "Cotton", "Nagpur", "Maharashtra", 6400.0, 6100.0, 7000.0, "Quintal"),
    )

    LaunchedEffect(Unit) {
        runCatching { repository.fetchMarketPrices() }
            .onSuccess { prices = it }
            .onFailure { error = it.message }
        loading = false
    }

    val source = if (prices.isNotEmpty()) prices else fallback
    val filteredPrices = source.filter {
        val term = search.trim().lowercase(Locale.getDefault())
        term.isBlank() ||
            it.cropName.lowercase(Locale.getDefault()).contains(term) ||
            it.district.lowercase(Locale.getDefault()).contains(term) ||
            it.state.lowercase(Locale.getDefault()).contains(term)
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Text("Marketplace", style = MaterialTheme.typography.headlineSmall)
        }
        item {
            OutlinedTextField(
                value = search,
                onValueChange = { search = it },
                modifier = Modifier.fillMaxWidth(),
                label = { Text("Search crop or district") },
            )
        }
        if (loading) item { Text("Loading live market prices...") }
        if (!error.isNullOrBlank()) item { Text("$error. Showing fallback data.", color = MaterialTheme.colorScheme.error) }
        items(filteredPrices) { price ->
            Card {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(price.cropName, fontWeight = FontWeight.SemiBold)
                    Text("${price.district}, ${price.state}")
                    Text("${formatInr(price.modalPrice)}/${price.unit}")
                    Text("Range: ${formatInr(price.minPrice)} - ${formatInr(price.maxPrice)}")
                }
            }
        }
    }
}

@Composable
private fun ChatScreen(repository: ApiRepository) {
    val messages = remember {
        mutableStateListOf(
            ChatMessage(
                "bot",
                "Hello! I'm your FarmGo AI Assistant. Ask me about crop recommendations, diseases, weather, or farming best practices.",
            ),
        )
    }
    var input by rememberSaveable { mutableStateOf("") }
    var sending by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("AI Assistant", style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            items(messages) { message ->
                val mine = message.role == "user"
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = if (mine) Arrangement.End else Arrangement.Start,
                ) {
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = if (mine) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                        ),
                        modifier = Modifier.fillMaxWidth(0.85f),
                    ) {
                        Text(
                            message.text,
                            modifier = Modifier.padding(12.dp),
                            color = if (mine) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
        }

        HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(
                value = input,
                onValueChange = { input = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Type your question...") },
                enabled = !sending,
            )
            Spacer(modifier = Modifier.width(8.dp))
            Button(
                onClick = {
                    if (input.isBlank() || sending) return@Button
                    val message = input.trim()
                    input = ""
                    sending = true
                    messages.add(ChatMessage("user", message))
                    scope.launch {
                        val reply = runCatching { repository.sendChatMessage(message) }
                            .getOrElse { it.message ?: "AI service unavailable right now." }
                        messages.add(ChatMessage("bot", reply))
                        sending = false
                    }
                },
                enabled = !sending,
            ) {
                Text(if (sending) "..." else "Send")
            }
        }
    }
}

@Composable
private fun DiseaseDetectionScreen(repository: ApiRepository) {
    val context = LocalContext.current
    var selectedUri by remember { mutableStateOf<Uri?>(null) }
    var selectedName by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(false) }
    var analysis by remember { mutableStateOf("") }
    var error by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    val imagePicker = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        selectedUri = uri
        selectedName = uri?.lastPathSegment ?: "selected-image"
        error = null
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Disease Detection", style = MaterialTheme.typography.headlineSmall)
        Text("Upload a leaf photo to get AI diagnosis and treatment suggestions.")

        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            OutlinedButton(onClick = { imagePicker.launch("image/*") }) {
                Text("Choose Image")
            }
            Button(
                onClick = {
                    val uri = selectedUri ?: return@Button
                    loading = true
                    analysis = ""
                    error = null
                    scope.launch {
                        val result = runCatching {
                            val bytes = context.contentResolver.openInputStream(uri)?.use { it.readBytes() }
                                ?: throw IllegalStateException("Failed to read selected image")
                            val base64 = Base64.encodeToString(bytes, Base64.NO_WRAP)
                            repository.analyzeDisease(base64, "image/jpeg")
                        }
                        result.onSuccess { analysis = it }
                        result.onFailure { error = it.message ?: "Failed to analyze image" }
                        loading = false
                    }
                },
                enabled = selectedUri != null && !loading,
            ) {
                Text(if (loading) "Analyzing..." else "Analyze")
            }
        }

        selectedName?.let { Text("Selected: $it", style = MaterialTheme.typography.bodySmall) }
        error?.let { Text(it, color = MaterialTheme.colorScheme.error) }

        if (analysis.isNotBlank()) {
            Card {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("AI Analysis", style = MaterialTheme.typography.titleMedium)
                    Text(analysis)
                }
            }
        }
    }
}

@Composable
private fun InfoListScreen(title: String, items: List<Pair<String, String>>) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Text(title, style = MaterialTheme.typography.headlineSmall)
        }
        items(items) { item ->
            Card {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(item.first, fontWeight = FontWeight.SemiBold)
                    Text(item.second)
                }
            }
        }
    }
}

@Composable
private fun BlogScreen() {
    val posts = listOf(
        "How AI is Transforming Crop Disease Detection" to "Feb 10, 2026 - 5 min",
        "Top 5 Government Schemes Every Farmer Should Know" to "Feb 8, 2026 - 4 min",
        "Maximizing Yield with Smart Irrigation Techniques" to "Feb 5, 2026 - 6 min",
        "Understanding Market Prices: A Farmer's Guide" to "Feb 3, 2026 - 3 min",
    )
    InfoListScreen("Ag News & Insights", posts)
}

@Composable
private fun ContactScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Text("Contact Us", style = MaterialTheme.typography.headlineSmall)
        Text("support@agritech.in")
        Text("+91 800 123 4567")
        Text("FarmGo HQ, New Delhi, India")
        Spacer(modifier = Modifier.height(8.dp))
        Text("Send Message", style = MaterialTheme.typography.titleMedium)
        OutlinedTextField(value = "", onValueChange = {}, label = { Text("First Name") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(value = "", onValueChange = {}, label = { Text("Last Name") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(value = "", onValueChange = {}, label = { Text("Email") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(value = "", onValueChange = {}, label = { Text("Subject") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(value = "", onValueChange = {}, label = { Text("Message") }, modifier = Modifier.fillMaxWidth())
        FilterChip(selected = false, onClick = {}, label = { Text("Form submission is static in this version") })
    }
}

private val aboutItems = listOf(
    "Mission-Driven" to "Empowering Indian farmers with accessible AI-driven tools for smarter agriculture.",
    "Community First" to "Connecting farmers, buyers, suppliers, and agronomists across India.",
    "Innovation" to "Using machine learning and computer vision for real farming outcomes.",
    "Sustainability" to "Promoting practices that protect soil health and reduce environmental impact.",
)

private val yieldItems = listOf(
    "Historical Analysis" to "Analyze long-term yield data for pattern recognition.",
    "Predictive Models" to "Multiple ML models trained on regional crop performance.",
    "Location-Aware" to "Predictions adjusted for local soil, climate, and water conditions.",
    "Seasonal Forecasts" to "Plan season-wise projections and market timing.",
)

private val financeItems = listOf(
    "Kisan Credit Card" to "Affordable credit for crop production and farm equipment.",
    "Crop Insurance" to "Protect your harvest against calamities and price drops.",
    "Savings Plans" to "Agricultural savings options with competitive returns.",
    "Expense Tracking" to "Track farm expenses, revenues, and profitability.",
)

private fun formatInr(value: Double): String {
    val format = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("en-IN"))
    format.maximumFractionDigits = 0
    return format.format(value)
}

private fun formatTwoDecimals(value: Double): String {
    return String.format(Locale.US, "%.2f", value)
}
