package com.airdropclone.model

data class Device(
    val id: String = "",
    val name: String = "",
    val code: String = "",
    val ip: String = "",
    val status: String = "offline",
    val lastSeen: String = ""
)

data class ValidationResponse(
    val success: Boolean,
    val device: Device? = null
)

data class RegisterResponse(
    val success: Boolean,
    val code: String = ""
)

data class LogResponse(
    val success: Boolean,
    val message: String = ""
)
