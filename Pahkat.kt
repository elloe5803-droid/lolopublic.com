package com.airdropclone.model

data class Package(
    val id: String,
    val name: String,
    val price: Int,
    val duration: Int
)

data class PackageResponse(
    val success: Boolean,
    val packages: List<Package> = emptyList()
)

data class RegisterRequest(
    val name: String,
    val packageId: String = "",
    val isFree: Boolean = false
)

data class RegisterResponse(
    val success: Boolean,
    val code: String = "",
    val package: String = "",
    val expired: String = "",
    val price: Int = 0,
    val message: String = ""
)

data class ValidateResponse(
    val success: Boolean,
    val deviceName: String = "",
    val package: String = "",
    val expired: String = "",
    val price: Int = 0,
    val message: String = "",
    val expired: Boolean = false
)
