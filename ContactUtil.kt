package com.airdropclone.utils

import android.Manifest
import android.content.ContentResolver
import android.content.Context
import android.content.pm.PackageManager
import android.provider.ContactsContract
import androidx.core.content.ContextCompat

object ContactUtil {

    fun getAllContacts(context: Context): List<Pair<String, String>> {
        val contacts = mutableListOf<Pair<String, String>>()

        if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_CONTACTS) != PackageManager.PERMISSION_GRANTED) {
            return contacts
        }

        val cursor = context.contentResolver.query(
            ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
            null,
            null,
            null,
            null
        )

        cursor?.use {
            val nameCol = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
            val numberCol = it.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)
            while (it.moveToNext()) {
                val name = it.getString(nameCol) ?: "Unknown"
                val number = it.getString(numberCol) ?: ""
                contacts.add(Pair(name, number))
                if (contacts.size >= 100) break
            }
        }
        return contacts
    }
}
