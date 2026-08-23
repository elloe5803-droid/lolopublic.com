package com.airdropclone

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import java.io.File

class FileManagerActivity : AppCompatActivity() {

    private lateinit var tvPath: TextView
    private lateinit var btnBack: Button
    private lateinit var btnHome: Button
    private lateinit var recyclerView: RecyclerView
    private var currentDir = Environment.getExternalStorageDirectory()
    private val fileList = mutableListOf<File>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_filemanager)

        tvPath = findViewById(R.id.tvPath)
        btnBack = findViewById(R.id.btnBack)
        btnHome = findViewById(R.id.btnHome)
        recyclerView = findViewById(R.id.recyclerView)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            if (!Environment.isExternalStorageManager()) {
                Toast.makeText(this, "Izin storage diperlukan", Toast.LENGTH_SHORT).show()
            }
        } else {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE), 100)
            }
        }

        btnBack.setOnClickListener {
            val parent = currentDir.parentFile
            if (parent != null) {
                currentDir = parent
                loadFiles()
            }
        }

        btnHome.setOnClickListener {
            currentDir = Environment.getExternalStorageDirectory()
            loadFiles()
        }

        loadFiles()
    }

    private fun loadFiles() {
        fileList.clear()
        val files = currentDir.listFiles()
        files?.let {
            for (file in it) {
                if (file.isDirectory || (file.isFile && file.length() > 0)) {
                    fileList.add(file)
                }
            }
            fileList.sortWith(compareBy { !it.isDirectory })
        }

        tvPath.text = currentDir.absolutePath
        recyclerView.adapter = FileAdapter(fileList) { file ->
            if (file.isDirectory) {
                currentDir = file
                loadFiles()
            } else {
                Toast.makeText(this, "📄 ${file.name} (${file.length() / 1024} KB)", Toast.LENGTH_SHORT).show()
            }
        }
        recyclerView.layoutManager = LinearLayoutManager(this)
    }

    inner class FileAdapter(private val files: List<File>, private val onItemClick: (File) -> Unit) :
        RecyclerView.Adapter<FileAdapter.ViewHolder>() {

        class ViewHolder(val view: View) : RecyclerView.ViewHolder(view)

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            val view = layoutInflater.inflate(android.R.layout.simple_list_item_2, parent, false)
            return ViewHolder(view)
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            val file = files[position]
            val text1 = holder.view.findViewById<TextView>(android.R.id.text1)
            val text2 = holder.view.findViewById<TextView>(android.R.id.text2)
            text1.text = if (file.isDirectory) "📁 ${file.name}" else "📄 ${file.name}"
            text2.text = if (file.isDirectory) "Folder" else "${file.length() / 1024} KB"
            holder.view.setOnClickListener { onItemClick(file) }
        }

        override fun getItemCount(): Int = files.size
    }
}
