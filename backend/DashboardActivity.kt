// DashboardActivity.kt
package com.airdropclone

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class DashboardActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        val tvStatus = findViewById<TextView>(R.id.tvStatus)
        tvStatus.text = "📡 Terhubung ke server gratis"

        findViewById<Button>(R.id.btnScreenshot).setOnClickListener {
            tvStatus.text = "📸 Screenshot diambil"
        }
        findViewById<Button>(R.id.btnCamera).setOnClickListener {
            tvStatus.text = "📷 Kamera dibuka"
        }
        findViewById<Button>(R.id.btnLocation).setOnClickListener {
            tvStatus.text = "📍 Lokasi dikirim"
        }
