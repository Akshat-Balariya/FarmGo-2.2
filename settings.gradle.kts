pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
    
    versionCatalogs {
        create("libs") {
            from(files("client/gradle/libs.versions.toml"))
        }
    }
}

rootProject.name = "AgriGo"

// Include client module and its submodules
include(":client")
include(":client:app")

project(":client").projectDir = file("client")
project(":client:app").projectDir = file("client/app")

