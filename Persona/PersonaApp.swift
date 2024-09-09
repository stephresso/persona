//
//  PersonaApp.swift
//  Persona
//
//  Created by Stephanie Torres on 9/9/24.
//

import SwiftUI

@main
struct PersonaApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
