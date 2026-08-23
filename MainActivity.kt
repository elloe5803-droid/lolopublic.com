package com.airdropclone

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.airdropclone.api.ApiService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    private lateinit var etCode: EditText
    private lateinit var btnLogin: Button
    private val api = ApiService.create()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        etCode = findViewById(R.id.etCode)
        btnLogin = findViewById(R.id.btnLogin)

        btnLogin.setOnClickListener {
            val code = etCode.text.toString().trim()
            if (code.length == 6) {
                validateCode(code)
            } else {
                Toast.makeText(this, "Kode harus 6 digit!", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun validateCode(code: String) {
        api.validate(code).enqueue(object : Callback<com.airdropclone.model.ValidationResponse> {
            override fun onResponse(call: Call<com.airdropclone.model.ValidationResponse>, response: Response<com.airdropclone.model.ValidationResponse>) {
                if (response.isSuccessful && response.body()?.success == true) {
                    Toast.makeText(this@MainActivity, "✅ Login berhasil!", Toast.LENGTH_SHORT).show()
                    val intent = Intent(this@MainActivity, DashboardActivity::class.java)
                    intent.putExtra("device", response.body()?.device)
                    startActivity(intent)
                    finish()
                } else {
                    Toast.makeText(this@MainActivity, "❌ Kode salah atau expired!", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<com.airdropclone.model.ValidationResponse>, t: Throwable) {
                Toast.makeText(this@MainActivity, "❌ Gagal koneksi ke server: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
