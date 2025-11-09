import { open } from "sqlite";
import sqlite3 from "sqlite3";

/**
 * Script de migration pour ajouter l'authentification à la base de données existante
 * 
 * Ce script :
 * 1. Crée la table users si elle n'existe pas
 * 2. Modifie la table cart pour ajouter user_id
 * 3. Migre les données existantes si nécessaire
 */

async function migrate() {
  console.log("🚀 Début de la migration...");

  const db = await open({
    filename: "./ecommerce.sqlite",
    driver: sqlite3.Database,
  });

  try {
    // Vérifier si la table users existe
    const usersTableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    );

    if (!usersTableExists) {
      console.log("📝 Création de la table users...");
      await db.exec(`CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      console.log("✅ Table users créée");
    } else {
      console.log("ℹ️  Table users existe déjà");
    }

    // Vérifier la structure de la table cart
    const cartColumns = await db.all("PRAGMA table_info(cart)");
    const hasUserId = cartColumns.some(col => col.name === 'user_id');
    const hasCartId = cartColumns.some(col => col.name === 'cart_id');

    if (!hasUserId || !hasCartId) {
      console.log("📝 Migration de la table cart...");
      
      // Sauvegarder les données existantes
      const existingCartData = await db.all("SELECT * FROM cart");
      console.log(`ℹ️  ${existingCartData.length} éléments dans le panier à migrer`);

      // Supprimer l'ancienne table
      await db.exec("DROP TABLE IF EXISTS cart");
      console.log("🗑️  Ancienne table cart supprimée");

      // Créer la nouvelle table
      await db.exec(`CREATE TABLE cart (
        cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        product_price REAL NOT NULL,
        product_category TEXT NOT NULL,
        product_quantity INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        UNIQUE(user_id, product_id)
      )`);
      console.log("✅ Nouvelle table cart créée");

      // Note: Les anciennes données du panier ne sont pas migrées car elles n'ont pas de user_id
      // Les utilisateurs devront se reconnecter et ajouter les produits à nouveau
      if (existingCartData.length > 0) {
        console.log("⚠️  Les anciennes données du panier ont été supprimées");
        console.log("⚠️  Les utilisateurs devront ajouter à nouveau les produits après connexion");
      }
    } else {
      console.log("ℹ️  Table cart déjà à jour");
    }

    console.log("✅ Migration terminée avec succès!");
    console.log("\n📋 Résumé:");
    
    const usersCount = await db.get("SELECT COUNT(*) as count FROM users");
    const cartCount = await db.get("SELECT COUNT(*) as count FROM cart");
    const productsCount = await db.get("SELECT COUNT(*) as count FROM product");
    
    console.log(`   - Utilisateurs: ${usersCount.count}`);
    console.log(`   - Produits: ${productsCount.count}`);
    console.log(`   - Articles dans les paniers: ${cartCount.count}`);

  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
    throw error;
  } finally {
    await db.close();
  }
}

// Exécuter la migration
migrate()
  .then(() => {
    console.log("\n✨ Vous pouvez maintenant lancer le serveur avec: node api.js");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ La migration a échoué:", error);
    process.exit(1);
  });
