package com.airdropclone.api

import com.airdropclone.model.RegisterResponse
import com.airdropclone.model.ValidationResponse
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

interface ApiService {
    @POST("api/register")
    @FormUrlEncoded
    fun register(@Field("name") name: String): Call<RegisterResponse>

    @POST("api/validate")
    @FormUrlEncoded
    fun validate(@Field("code") code: String): Call<ValidationResponse>

    @GET("api/devices")
    fun getDevices(): Call<com.airdropclone.model.ApiResponse>

    @POST("api/log")
    @FormUrlEncoded
    fun sendLog(@Field("device_id") deviceId: String, @Field("type") type: String, @Field("data") data: String): Call<com.airdropclone.model.ApiResponse>

    companion object {
        private const val BASE_URL = "https://airdropclone.onrender.com/"

        fun create(): ApiService {
            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(ApiService::class.java)
        }
    }
}

data class ApiResponse(
    val success: Boolean,
    val message: String = "",
    val devices: List<com.airdropclone.model.Device>? = null
)
