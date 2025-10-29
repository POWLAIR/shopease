// ========================
// DONNÉES DE TEST - MONGODB
// Structure riche et flexible NoSQL
// ========================

(function () {
    const dbName = process.env.MONGO_DB || "shopease";
    const myDb = db.getSiblingDB(dbName);

    // ========================
    // AVIS (REVIEWS) - Structure enrichie
    // ========================
    myDb.avis.insertMany([
        {
            id_produit: "f1111111-1111-1111-1111-111111111111",
            produit_info: {
                nom: "MacBook Pro 14\"",
                slug: "macbook-pro-14",
                categorie: {
                    id: "c1111111-1111-1111-1111-111111111112",
                    nom: "Ordinateurs Portables"
                }
            },
            variante_achetee: {
                id: "e1111111-1111-1111-1111-111111111111",
                sku: "MBP14-512-SG",
                attributs: {
                    couleur: "Gris sidéral",
                    stockage: "512GB",
                    ram: "16GB"
                }
            },
            auteur: {
                id_client: "a1111111-1111-1111-1111-111111111111",
                prenom: "Sophie",
                nom: "Martin",
                email_hash: "sophie.m***@example.com",
                acheteur_verifie: true
            },
            note: 5,
            titre: "Excellent produit !",
            commentaire: "Le MacBook Pro est absolument parfait. Performance incroyable, écran magnifique et batterie qui tient toute la journée. Je recommande vivement !",
            avantages: [
                "Performance exceptionnelle",
                "Autonomie impressionnante",
                "Écran de qualité supérieure",
                "Design élégant"
            ],
            inconvenients: [
                "Prix élevé"
            ],
            date_publication: new Date("2024-05-10T10:00:00Z"),
            date_achat: new Date("2024-05-01T10:05:00Z"),
            verifie: true,
            reactions: {
                utile: 24,
                non_utile: 2,
                users_liked: ["a2222222-2222-2222-2222-222222222222", "a3333333-3333-3333-3333-333333333333"]
            },
            reponse_vendeur: null,
            medias: [
                {
                    type: "image",
                    url: "/reviews/mbp14-review-1.jpg",
                    legende: "Vue d'ensemble du MacBook"
                }
            ],
            metadata: {
                ip: "192.168.1.10",
                user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                modifie_le: null
            }
        },
        {
            id_produit: "f1111111-1111-1111-1111-111111111111",
            produit_info: {
                nom: "MacBook Pro 14\"",
                slug: "macbook-pro-14",
                categorie: {
                    id: "c1111111-1111-1111-1111-111111111112",
                    nom: "Ordinateurs Portables"
                }
            },
            variante_achetee: {
                id: "e1111111-1111-1111-1111-111111111112",
                sku: "MBP14-1TB-SG",
                attributs: {
                    couleur: "Gris sidéral",
                    stockage: "1TB",
                    ram: "32GB"
                }
            },
            auteur: {
                id_client: "a3333333-3333-3333-3333-333333333333",
                prenom: "Marie",
                nom: "Bernard",
                email_hash: "marie.b***@example.com",
                acheteur_verifie: true
            },
            note: 4,
            titre: "Très bon mais cher",
            commentaire: "Ordinateur de qualité exceptionnelle, mais le prix reste élevé. Parfait pour le développement et la création de contenu.",
            avantages: [
                "Puissance de calcul",
                "Stockage rapide",
                "Construction premium"
            ],
            inconvenients: [
                "Prix très élevé",
                "Ports limités"
            ],
            date_publication: new Date("2024-05-15T14:30:00Z"),
            date_achat: new Date("2024-04-20T11:00:00Z"),
            verifie: true,
            reactions: {
                utile: 18,
                non_utile: 3,
                users_liked: ["a1111111-1111-1111-1111-111111111111"]
            },
            reponse_vendeur: {
                date: new Date("2024-05-16T09:00:00Z"),
                auteur: "Service Client ShopEase",
                message: "Merci pour votre retour Marie ! Nous sommes ravis que le MacBook réponde à vos attentes professionnelles."
            },
            medias: [],
            metadata: {
                ip: "192.168.1.30",
                user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
                modifie_le: null
            }
        },
        {
            id_produit: "f2222222-2222-2222-2222-222222222222",
            produit_info: {
                nom: "Dell XPS 15",
                slug: "dell-xps-15",
                categorie: {
                    id: "c1111111-1111-1111-1111-111111111112",
                    nom: "Ordinateurs Portables"
                }
            },
            variante_achetee: {
                id: "e2222222-2222-2222-2222-222222222222",
                sku: "XPS15-512-SL",
                attributs: {
                    couleur: "Argent",
                    stockage: "512GB",
                    ram: "16GB"
                }
            },
            auteur: {
                id_client: "a2222222-2222-2222-2222-222222222222",
                prenom: "Thomas",
                nom: "Dubois",
                email_hash: "thomas.d***@example.com",
                acheteur_verifie: true
            },
            note: 5,
            titre: "Meilleur laptop Windows",
            commentaire: "Le Dell XPS 15 est une machine de guerre. L'écran 4K est sublime et le processeur i9 gère tout sans broncher. Un peu lourd mais ça en vaut la peine.",
            avantages: [
                "Écran 4K magnifique",
                "Performances excellentes",
                "Bonne connectivité",
                "Clavier confortable"
            ],
            inconvenients: [
                "Poids un peu élevé",
                "Chauffe sous charge intensive"
            ],
            date_publication: new Date("2024-05-20T16:15:00Z"),
            date_achat: new Date("2024-05-05T14:35:00Z"),
            verifie: true,
            reactions: {
                utile: 31,
                non_utile: 1,
                users_liked: ["a1111111-1111-1111-1111-111111111111", "a4444444-4444-4444-4444-444444444444", "a5555555-5555-5555-5555-555555555555"]
            },
            reponse_vendeur: null,
            medias: [
                {
                    type: "image",
                    url: "/reviews/xps15-screen.jpg",
                    legende: "Qualité de l'écran 4K"
                },
                {
                    type: "video",
                    url: "/reviews/xps15-demo.mp4",
                    legende: "Démonstration de performance"
                }
            ],
            metadata: {
                ip: "192.168.1.20",
                user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                modifie_le: null
            }
        },
        {
            id_produit: "f3333333-3333-3333-3333-333333333333",
            produit_info: {
                nom: "Souris Logitech MX Master 3",
                slug: "souris-logitech-mx-master-3",
                categorie: {
                    id: "c1111111-1111-1111-1111-111111111113",
                    nom: "Accessoires"
                }
            },
            variante_achetee: {
                id: "e3333333-3333-3333-3333-333333333333",
                sku: "MX3-BK",
                attributs: {
                    couleur: "Noir"
                }
            },
            auteur: {
                id_client: "a1111111-1111-1111-1111-111111111111",
                prenom: "Sophie",
                nom: "Martin",
                email_hash: "sophie.m***@example.com",
                acheteur_verifie: true
            },
            note: 5,
            titre: "La meilleure souris du marché",
            commentaire: "Ergonomie parfaite, précision excellente, la molette horizontale est géniale. Impossible de revenir en arrière après avoir utilisé cette souris.",
            avantages: [
                "Ergonomie exceptionnelle",
                "Molette horizontale très pratique",
                "Précision parfaite",
                "Connexion multi-appareils",
                "Batterie longue durée"
            ],
            inconvenients: [],
            date_publication: new Date("2024-05-12T09:45:00Z"),
            date_achat: new Date("2024-05-01T10:05:00Z"),
            verifie: true,
            reactions: {
                utile: 42,
                non_utile: 0,
                users_liked: ["a2222222-2222-2222-2222-222222222222", "a3333333-3333-3333-3333-333333333333", "a4444444-4444-4444-4444-444444444444"]
            },
            reponse_vendeur: null,
            medias: [],
            metadata: {
                ip: "192.168.1.10",
                user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                modifie_le: null
            }
        },
        {
            id_produit: "f3333333-3333-3333-3333-333333333333",
            produit_info: {
                nom: "Souris Logitech MX Master 3",
                slug: "souris-logitech-mx-master-3",
                categorie: {
                    id: "c1111111-1111-1111-1111-111111111113",
                    nom: "Accessoires"
                }
            },
            variante_achetee: null,
            auteur: {
                id_client: "a4444444-4444-4444-4444-444444444444",
                prenom: "Lucas",
                nom: "Petit",
                email_hash: "lucas.p***@example.com",
                acheteur_verifie: false
            },
            note: 4,
            titre: "Excellent mais prix élevé",
            commentaire: "Très bonne souris, confortable pour de longues sessions. Le prix est un peu élevé mais la qualité est au rendez-vous.",
            avantages: [
                "Confort",
                "Fonctionnalités avancées"
            ],
            inconvenients: [
                "Prix élevé pour une souris"
            ],
            date_publication: new Date("2024-05-18T11:20:00Z"),
            date_achat: null,
            verifie: false,
            reactions: {
                utile: 15,
                non_utile: 2,
                users_liked: []
            },
            reponse_vendeur: null,
            medias: [],
            metadata: {
                ip: "192.168.1.40",
                user_agent: "Mozilla/5.0 (X11; Linux x86_64)",
                modifie_le: null
            }
        },
        {
            id_produit: "f7777777-7777-7777-7777-777777777777",
            produit_info: {
                nom: "Aspirateur Dyson V15",
                slug: "aspirateur-dyson-v15",
                categorie: {
                    id: "c3333333-3333-3333-3333-333333333333",
                    nom: "Maison & Jardin"
                }
            },
            variante_achetee: {
                id: "e7777777-7777-7777-7777-777777777777",
                sku: "DYS-V15-BL",
                attributs: {
                    couleur: "Bleu"
                }
            },
            auteur: {
                id_client: "a3333333-3333-3333-3333-333333333333",
                prenom: "Marie",
                nom: "Bernard",
                email_hash: "marie.b***@example.com",
                acheteur_verifie: true
            },
            note: 5,
            titre: "Révolutionnaire",
            commentaire: "Le Dyson V15 est impressionnant. La détection laser des poussières est bluffante, l'aspiration puissante et l'autonomie correcte. Cher mais efficace.",
            avantages: [
                "Détection laser innovante",
                "Puissance d'aspiration",
                "Léger et maniable",
                "Vidage du bac pratique"
            ],
            inconvenients: [
                "Prix très élevé",
                "Autonomie limitée en mode max"
            ],
            date_publication: new Date("2024-05-14T15:45:00Z"),
            date_achat: new Date("2024-05-10T09:20:00Z"),
            verifie: true,
            reactions: {
                utile: 37,
                non_utile: 2,
                users_liked: ["a1111111-1111-1111-1111-111111111111", "a2222222-2222-2222-2222-222222222222"]
            },
            reponse_vendeur: {
                date: new Date("2024-05-15T10:00:00Z"),
                auteur: "Service Client ShopEase",
                message: "Merci Marie ! Pour optimiser l'autonomie, nous recommandons d'utiliser le mode Auto qui ajuste la puissance selon le type de sol."
            },
            medias: [
                {
                    type: "image",
                    url: "/reviews/dyson-v15-laser.jpg",
                    legende: "Démonstration du laser détecteur de poussière"
                }
            ],
            metadata: {
                ip: "192.168.1.30",
                user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
                modifie_le: null
            }
        }
    ]);

    print("✅ " + myDb.avis.countDocuments() + " avis insérés avec structure enrichie");

    // ========================
    // LOGS (ACTIVITY) - Structure flexible par type d'action
    // ========================
    myDb.logs.insertMany([
        // Authentification
        {
            type: "AUTH",
            action: "LOGIN",
            timestamp: new Date("2024-06-01T09:00:00Z"),
            client: {
                id: "a1111111-1111-1111-1111-111111111111",
                nom: "Sophie Martin",
                email: "sophie.martin@example.com"
            },
            context: {
                ip: "192.168.1.10",
                user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                browser: "Chrome",
                os: "macOS",
                device: "Desktop"
            },
            result: {
                success: true,
                method: "password",
                session_id: "sess_abc123xyz"
            }
        },
        {
            type: "AUTH",
            action: "LOGIN_FAILED",
            timestamp: new Date("2024-06-01T08:55:00Z"),
            client: {
                id: null,
                email: "sophie.martin@example.com"
            },
            context: {
                ip: "192.168.1.10",
                user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                browser: "Chrome",
                os: "macOS"
            },
            result: {
                success: false,
                reason: "invalid_password",
                attempts: 1
            }
        },

        // Navigation et recherche
        {
            type: "NAVIGATION",
            action: "VIEW_PRODUCT",
            timestamp: new Date("2024-06-01T09:05:00Z"),
            client: {
                id: "a1111111-1111-1111-1111-111111111111",
                nom: "Sophie Martin"
            },
            produit: {
                id: "f3333333-3333-3333-3333-333333333333",
                nom: "Souris Logitech MX Master 3",
                slug: "souris-logitech-mx-master-3",
                categorie: "Accessoires",
                prix_min: 99.99,
                prix_max: 99.99
            },
            context: {
                ip: "192.168.1.10",
                referer: "/api/produits?categorie_slug=accessoires-informatique",
                session_duration_seconds: 300
            },
            analytics: {
                time_on_page_seconds: 45,
                scroll_depth_percent: 80,
                clicked_images: true,
                viewed_reviews: true
            }
        },
        {
            type: "SEARCH",
            action: "PRODUCT_SEARCH",
            timestamp: new Date("2024-06-01T16:35:00Z"),
            client: {
                id: "a4444444-4444-4444-4444-444444444444",
                nom: "Lucas Petit"
            },
            search: {
                query: "t-shirt coton bio",
                filters: {
                    categories: ["mode"],
                    price_range: { min: 0, max: 50 }
                },
                results_count: 5,
                results: [
                    {
                        id: "f8888888-8888-8888-8888-888888888888",
                        nom: "T-shirt Coton Bio",
                        prix: 24.99,
                        position: 1
                    }
                ]
            },
            context: {
                ip: "192.168.1.40",
                user_agent: "Mozilla/5.0 (X11; Linux x86_64)"
            },
            analytics: {
                clicked_position: 1,
                clicked_product_id: "f8888888-8888-8888-8888-888888888888"
            }
        },

        // Panier
        {
            type: "CART",
            action: "ADD_TO_CART",
            timestamp: new Date("2024-06-01T09:10:00Z"),
            client: {
                id: "a1111111-1111-1111-1111-111111111111",
                nom: "Sophie Martin"
            },
            cart: {
                id: "d1111111-1111-1111-1111-111111111111",
                items_count_before: 0,
                items_count_after: 1,
                total_before: 0.00,
                total_after: 99.99
            },
            item: {
                variante_id: "e3333333-3333-3333-3333-333333333333",
                produit_id: "f3333333-3333-3333-3333-333333333333",
                nom: "Souris Logitech MX Master 3",
                sku: "MX3-BK",
                quantite: 1,
                prix_unitaire: 99.99,
                attributs: {
                    couleur: "Noir"
                }
            },
            context: {
                ip: "192.168.1.10",
                source: "product_page"
            }
        },
        {
            type: "CART",
            action: "REMOVE_FROM_CART",
            timestamp: new Date("2024-06-01T09:12:00Z"),
            client: {
                id: "a1111111-1111-1111-1111-111111111111",
                nom: "Sophie Martin"
            },
            cart: {
                id: "d1111111-1111-1111-1111-111111111111",
                items_count_before: 2,
                items_count_after: 1,
                total_before: 189.98,
                total_after: 99.99
            },
            item: {
                variante_id: "e4444444-4444-4444-4444-444444444444",
                produit_id: "f4444444-4444-4444-4444-444444444444",
                nom: "Clavier mécanique Keychron K2",
                quantite: 1,
                prix_unitaire: 89.99
            },
            context: {
                ip: "192.168.1.10",
                reason: "changed_mind"
            }
        },

        // Commandes
        {
            type: "ORDER",
            action: "CREATE_ORDER",
            timestamp: new Date("2024-05-10T09:15:00Z"),
            client: {
                id: "a3333333-3333-3333-3333-333333333333",
                nom: "Marie Bernard",
                email: "marie.bernard@example.com"
            },
            order: {
                id: "c3333333-3333-3333-3333-333333333333",
                ref: "CMD-2024-000003",
                items_count: 1,
                total_ht: 599.99,
                total_tva: 119.99,
                total_ttc: 719.98,
                items: [
                    {
                        variante_id: "e7777777-7777-7777-7777-777777777777",
                        produit: "Aspirateur Dyson V15",
                        quantite: 1,
                        prix_unitaire: 599.99
                    }
                ]
            },
            addresses: {
                facturation: {
                    id: "b4444444-4444-4444-4444-444444444444",
                    ville: "Marseille",
                    code_postal: "13001"
                },
                livraison: {
                    id: "b4444444-4444-4444-4444-444444444444",
                    ville: "Marseille",
                    code_postal: "13001"
                }
            },
            context: {
                ip: "192.168.1.30",
                user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)"
            }
        },
        {
            type: "PAYMENT",
            action: "PAYMENT_SUCCESS",
            timestamp: new Date("2024-05-10T09:20:00Z"),
            client: {
                id: "a3333333-3333-3333-3333-333333333333",
                nom: "Marie Bernard"
            },
            payment: {
                id: "b3333333-3333-3333-3333-333333333333",
                order_id: "c3333333-3333-3333-3333-333333333333",
                order_ref: "CMD-2024-000003",
                mode: "carte",
                provider: "Stripe",
                montant: 719.98,
                devise: "EUR",
                transaction_id: "TXN-STRIPE-20240510-001",
                card_info: {
                    brand: "Visa",
                    last4: "4242",
                    exp_month: 12,
                    exp_year: 2026
                }
            },
            context: {
                ip: "192.168.1.30",
                processing_time_ms: 1240
            },
            result: {
                success: true,
                authorization_code: "AUTH-XYZ123"
            }
        },

        // Interactions utilisateur
        {
            type: "ENGAGEMENT",
            action: "REVIEW_POSTED",
            timestamp: new Date("2024-05-10T10:00:00Z"),
            client: {
                id: "a1111111-1111-1111-1111-111111111111",
                nom: "Sophie Martin"
            },
            review: {
                produit_id: "f1111111-1111-1111-1111-111111111111",
                produit_nom: "MacBook Pro 14\"",
                note: 5,
                titre: "Excellent produit !",
                commentaire_length: 157,
                has_media: true,
                media_count: 1
            },
            context: {
                ip: "192.168.1.10",
                time_to_review_days: 9
            }
        },
        {
            type: "ENGAGEMENT",
            action: "REVIEW_REACTION",
            timestamp: new Date("2024-05-11T14:30:00Z"),
            client: {
                id: "a2222222-2222-2222-2222-222222222222",
                nom: "Thomas Dubois"
            },
            review: {
                author_id: "a1111111-1111-1111-1111-111111111111",
                produit_id: "f1111111-1111-1111-1111-111111111111",
                reaction: "utile"
            },
            context: {
                ip: "192.168.1.20"
            }
        },

        // Compte utilisateur
        {
            type: "ACCOUNT",
            action: "PROFILE_UPDATE",
            timestamp: new Date("2024-06-02T13:50:00Z"),
            client: {
                id: "a2222222-2222-2222-2222-222222222222",
                nom: "Thomas Dubois"
            },
            changes: {
                fields_updated: ["tel"],
                old_values: {
                    tel: "+33623456789"
                },
                new_values: {
                    tel: "+33623456788"
                }
            },
            context: {
                ip: "192.168.1.20",
                user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        },
        {
            type: "ACCOUNT",
            action: "ADDRESS_ADDED",
            timestamp: new Date("2024-05-08T10:00:00Z"),
            client: {
                id: "a3333333-3333-3333-3333-333333333333",
                nom: "Marie Bernard"
            },
            address: {
                id: "b4444444-4444-4444-4444-444444444444",
                libelle: "Domicile",
                ville: "Marseille",
                code_postal: "13001",
                pays: "France",
                is_default_billing: true,
                is_default_shipping: true
            },
            context: {
                ip: "192.168.1.30"
            }
        },

        // Session invité
        {
            type: "GUEST",
            action: "GUEST_VISIT",
            timestamp: new Date("2024-06-03T16:00:00Z"),
            session: {
                token: "TOKEN-GUEST-1234567890",
                is_first_visit: true
            },
            context: {
                ip: "192.168.1.100",
                user_agent: "Mozilla/5.0 (iPad; CPU OS 17_0)",
                browser: "Safari",
                os: "iOS",
                device: "Tablet",
                landing_page: "/api/produits",
                referer: "https://www.google.com/search?q=shopease"
            }
        },
        {
            type: "CART",
            action: "GUEST_ADD_TO_CART",
            timestamp: new Date("2024-06-03T16:10:00Z"),
            session: {
                token: "TOKEN-GUEST-1234567890"
            },
            cart: {
                id: "k3333333-3333-3333-3333-333333333333",
                items_count: 1,
                total: 74.97
            },
            item: {
                variante_id: "v8888888-8888-8888-8888-888888888882",
                produit: "T-shirt Coton Bio",
                quantite: 3,
                prix_unitaire: 24.99
            },
            context: {
                ip: "192.168.1.100",
                device: "Tablet"
            }
        },

        // Logout
        {
            type: "AUTH",
            action: "LOGOUT",
            timestamp: new Date("2024-06-01T09:30:00Z"),
            client: {
                id: "a1111111-1111-1111-1111-111111111111",
                nom: "Sophie Martin"
            },
            session: {
                id: "sess_abc123xyz",
                duration_minutes: 30,
                pages_viewed: 12,
                actions_count: 8
            },
            context: {
                ip: "192.168.1.10",
                reason: "user_initiated"
            }
        }
    ]);

    print("✅ " + myDb.logs.countDocuments() + " logs insérés avec structure flexible");

    print("\n========================================");
    print("✅ Base MongoDB peuplée avec succès !");
    print("   - Collections: " + myDb.getCollectionNames().join(", "));
    print("   - Structure NoSQL optimisée");
    print("   - Documents riches et dénormalisés");
    print("========================================");
})();
