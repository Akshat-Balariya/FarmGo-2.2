# AgriGo Android Client

Native Android app (Jetpack Compose) for AgriGo, built to mirror the web app features in `server/agrinova-ui-main`.

## Implemented parity features

- Home screen with hero image reused from web asset (`hero-farm.jpg`)
- Crop Monitoring with live weather lookup (`/api/v1/current`)
- Farmer Schemes (`/api/v1/schemes`) with fallback data
- Marketplace (`/api/v1/market/prices`) with search and fallback data
- AI Chat (`/api/chat` on chat server)
- Disease Detection with image picker + base64 analysis (`/api/chat`)
- Static parity pages: About, Blog, Contact, Yield Prediction, Financial Support

## Configuration

Set backend URLs in `gradle.properties`:

```properties
API_BASE_URL=http://10.0.2.2:5000
CHAT_API_BASE_URL=http://10.0.2.2:3000
```

`10.0.2.2` is correct when running Android Emulator and backend on the host machine.

## Build and run

```powershell
cd C:\Users\aksha\AndroidStudioProjects\AgriGo\client
.\gradlew.bat :app:assembleDebug --no-daemon
```

Install/run from Android Studio or use `adb install` with the generated APK in `app\build\outputs\apk\debug`.

## Notes

- Networking uses OkHttp and JSON parsing via `org.json`.
- Internet permission is declared in `app/src/main/AndroidManifest.xml`.
- Color palette in `ui/theme` was aligned with web design tokens for visual consistency.

