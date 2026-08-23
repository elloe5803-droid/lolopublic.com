// ContentView.swift
import SwiftUI

struct ContentView: View {
    @State private var code = ""
    @State private var loggedIn = false
    @State private var error = ""

    var body: some View {
        if loggedIn {
            DashboardView()
        } else {
            VStack {
                Text("🦅 AirDroid Clone")
                    .font(.largeTitle)
                Text("Masukkan kode akses 6 digit")
                TextField("Kode", text: $code)
                    .keyboardType(.numberPad)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .frame(width: 200)
                Button("Login") {
                    validateCode(code: code)
                }
                .buttonStyle(.borderedProminent)
                Text(error).foregroundColor(.red)
            }
            .padding()
        }
    }

    func validateCode(code: String) {
        guard let url = URL(string: "https://airdropclone.onrender.com/api/validate") else { return }
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.httpBody = "code=\(code)".data(using: .utf8)

        URLSession.shared.dataTask(with: req) { data, _, _ in
            DispatchQueue.main.async {
                if let data = data,
                   let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                   json["success"] as? Bool == true {
                    loggedIn = true
                } else {
                    error = "Kode salah!"
                }
            }
        }.resume()
    }
}
