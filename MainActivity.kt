package com.airdropclone

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.airdropclone.api.ApiService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class UpgradeActivity : AppCompatActivity() {

    private val api = ApiService.create()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_upgrade)

        val tvPaket3Hari = findViewById<TextView>(R.id.tvPaket3Hari)
        val tvPaket1Minggu = findViewById<TextView>(R.id.tvPaket1Minggu)
        val tvPaket10Hari = findViewById<TextView>(R.id.tvPaket10Hari)
        val tvPaket1Bulan = findViewById<TextView>(R.id.tvPaket1Bulan)
        val btnBeli3Hari = findViewById<Button>(R.id.btnBeli3Hari)
        val btnBeli1Minggu = findViewById<Button>(R.id.btnBeli1Minggu)
        val btnBeli10Hari = findViewById<Button>(R.id.btnBeli10Hari)
        val btnBeli1Bulan = findViewById<Button>(R.id.btnBeli1Bulan)

        // Ambil data paket dari server
        api.getPackages().enqueue(object : Callback<com.airdropclone.model.PackageResponse> {
            override fun onResponse(call: Call<com.airdropclone.model.PackageResponse>, response: Response<com.airdropclone.model.PackageResponse>) {
                if (response.isSuccessful) {
                    val packages = response.body()?.packages ?: emptyList()
                    packages.forEach { pkg ->
                        when (pkg.id) {
                            "3hari" -> tvPaket3Hari.text = "${pkg.name} — Rp ${pkg.price}"
                            "1minggu" -> tvPaket1Minggu.text = "${pkg.name} — Rp ${pkg.price}"
                            "10hari" -> tvPaket10Hari.text = "${pkg.name} — Rp ${pkg.price}"
                            "1bulan" -> tvPaket1Bulan.text = "${pkg.name} — Rp ${pkg.price}"
                        }
                    }
                }
            }
            override fun onFailure(call: Call<com.airdropclone.model.PackageResponse>, t: Throwable) {
                Toast.makeText(this@UpgradeActivity, "Gagal ambil paket", Toast.LENGTH_SHORT).show()
            }
        })

        btnBeli3Hari.setOnClickListener { buyPackage("3hari", "Paket 3 Hari", 35000) }
        btnBeli1Minggu.setOnClickListener { buyPackage("1minggu", "Paket 1 Minggu", 55000) }
        btnBeli10Hari.setOnClickListener { buyPackage("10hari", "Paket 10 Hari", 150000) }
        btnBeli1Bulan.setOnClickListener { buyPackage("1bulan", "Paket 1 Bulan", 150000) }
    }

    private fun buyPackage(packageId: String, name: String, price: Int) {
        // Panggil API register dengan paket
        val request = com.airdropclone.model.RegisterRequest(
            name = "Device",
            packageId = packageId,
            isFree = false
        )

        api.register(request).enqueue(object : Callback<com.airdropclone.model.RegisterResponse> {
            override fun onResponse(call: Call<com.airdropclone.model.RegisterResponse>, response: Response<com.airdropclone.model.RegisterResponse>) {
                if (response.isSuccessful && response.body()?.success == true) {
                    val code = response.body()?.code ?: ""
                    // Tampilkan kode ke user
                    showPaymentDialog(code, name, price)
                } else {
                    Toast.makeText(this@UpgradeActivity, "Gagal membuat kode", Toast.LENGTH_SHORT).show()
                }
            }
            override fun onFailure(call: Call<com.airdropclone.model.RegisterResponse>, t: Throwable) {
                Toast.makeText(this@UpgradeActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun showPaymentDialog(code: String, packageName: String, price: Int) {
        val dialog = android.app.AlertDialog.Builder(this)
            .setTitle("💳 Konfirmasi Pembayaran")
            .setMessage("""
                Paket: $packageName
                Harga: Rp $price
                Kode Akses: $code
                
                Transfer ke:
                Bank BCA: 1234567890
                a/n: AllxDev
            """.trimIndent())
            .setPositiveButton("Saya Sudah Bayar") { _, _ ->
                // Verifikasi pembayaran (manual dulu)
                Toast.makeText(this, "✅ Kode aktif: $code", Toast.LENGTH_LONG).show()
                // Simpan kode ke SharedPreferences
                val prefs = getSharedPreferences("app", MODE_PRIVATE)
                prefs.edit().putString("access_code", code).apply()
                finish()
            }
            .setNegativeButton("Batal") { _, _ -> }
            .create()
        dialog.show()
    }
}
