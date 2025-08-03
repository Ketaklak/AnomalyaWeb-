from database import create_document
from models import Article, Service, Testimonial, Competence, FAQ
from datetime import datetime
import asyncio

# Mock data converted for database seeding
async def seed_articles():
    """Seed the database with sample articles"""
    articles = [
        {
            "id": "1",
            "title": "Nous sommes en ligne !",
            "category": "Actualités",
            "excerpt": "🚀 ANOMALYA.FR EST OFFICIELLEMENT LANCÉ ! 🎉 Une nouvelle ère commence ! Anomalya Corp. est là pour vous accompagner avec des...",
            "content": """
# 🚀 ANOMALYA.FR EST OFFICIELLEMENT LANCÉ ! 🎉

Une nouvelle ère commence ! **Anomalya Corp.** est là pour vous accompagner avec des solutions technologiques innovantes.

## Ce que nous offrons :

- **Développement Web** : Sites professionnels sur mesure
- **Intelligence Artificielle** : Conseils et implémentation IA
- **Maintenance & Réparation** : Support technique complet
- **Montage PC** : Assemblage professionnel

Notre équipe pluridisciplinaire est prête à transformer vos idées en réalité numérique. Découvrez dès maintenant nos services et rejoignez l'innovation !

*Ensemble, bâtissons un avenir où la technologie est à la portée de tous.*
            """,
            "image": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
            "date": datetime(2025, 1, 15),
            "isPinned": True,
            "author": "Équipe Anomalya",
            "readTime": "3 min",
            "tags": ["Lancement", "Innovation", "Entreprise"]
        },
        {
            "id": "2",
            "title": "Les tendances IA en 2025",
            "category": "Technology",
            "excerpt": "Découvrez les dernières tendances en intelligence artificielle qui révolutionnent le monde des affaires...",
            "content": """
# Les tendances IA en 2025 🤖

L'intelligence artificielle continue de transformer notre façon de travailler. Voici les tendances majeures à surveiller :

## 1. IA Générative dans l'entreprise
Les outils comme ChatGPT et Midjourney s'intègrent dans les workflows quotidiens.

## 2. Automatisation intelligente
Les processus métier sont de plus en plus automatisés grâce à l'IA.

## 3. IA éthique et responsable
Focus sur la transparence et l'équité des algorithmes.

**Anomalya Corp** vous accompagne dans l'adoption de ces technologies pour optimiser votre activité.
            """,
            "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
            "date": datetime(2025, 1, 10),
            "isPinned": False,
            "author": "Sarah Martinez",
            "readTime": "5 min",
            "tags": ["IA", "Tendances", "2025"]
        },
        {
            "id": "3",
            "title": "Cybersécurité : protégez votre entreprise",
            "category": "Sécurité",
            "excerpt": "Les cyberattaques augmentent chaque année. Découvrez nos conseils pour sécuriser votre infrastructure...",
            "content": """
# Cybersécurité : un enjeu majeur 🔒

La sécurité informatique n'est plus une option mais une nécessité absolue.

## Les principales menaces :
- **Ransomware** : chiffrement des données
- **Phishing** : vol d'identifiants
- **Failles de sécurité** : accès non autorisé

## Nos solutions :
1. Audit de sécurité complet
2. Formation des équipes
3. Mise en place de pare-feu avancés
4. Sauvegarde sécurisée

Contactez **Anomalya Corp** pour une évaluation gratuite de votre niveau de sécurité.
            """,
            "image": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
            "date": datetime(2025, 1, 5),
            "isPinned": False,
            "author": "Marc Dubois",
            "readTime": "4 min",
            "tags": ["Sécurité", "Cybersécurité", "Entreprise"]
        },
        {
            "id": "4",
            "title": "Nouveau partenariat avec TechInnovate",
            "category": "Partenariat",
            "excerpt": "Nous sommes fiers d'annoncer notre partenariat stratégique avec TechInnovate pour offrir encore plus de solutions...",
            "content": """
# Partenariat stratégique avec TechInnovate 🤝

Nous sommes ravis d'annoncer notre nouveau partenariat avec **TechInnovate**, leader en solutions cloud.

## Ce que cela apporte :
- Accès à des technologies cloud avancées
- Solutions d'hébergement haute performance
- Support technique 24/7
- Tarifs préférentiels pour nos clients

Cette collaboration nous permet d'enrichir notre offre et de proposer des solutions encore plus complètes à nos clients.

*L'innovation naît de la collaboration !*
            """,
            "image": "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=400&fit=crop",
            "date": datetime(2024, 12, 28),
            "isPinned": False,
            "author": "Direction Anomalya",
            "readTime": "2 min",
            "tags": ["Partenariat", "Cloud", "Innovation"]
        },
        {
            "id": "5",
            "title": "Formation gratuite : React vs Vue.js",
            "category": "Formation",
            "excerpt": "Participez à notre webinaire gratuit sur les frameworks JavaScript modernes. Comparez React et Vue.js...",
            "content": """
# Webinaire gratuit : React vs Vue.js ⚛️

Rejoignez notre session de formation gratuite le **25 janvier 2025** pour découvrir les différences entre React et Vue.js.

## Programme :
- **14h00 - 14h30** : Introduction aux frameworks
- **14h30 - 15h15** : React en détail
- **15h15 - 15h30** : Pause
- **15h30 - 16h15** : Vue.js expliqué
- **16h15 - 16h30** : Q&A

## Prérequis :
- Connaissances de base en JavaScript
- HTML/CSS

**Inscription gratuite** sur notre site. Places limitées !
            """,
            "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
            "date": datetime(2024, 12, 20),
            "isPinned": False,
            "author": "Thomas Leroux",
            "readTime": "3 min",
            "tags": ["Formation", "React", "Vue.js"]
        }
    ]
    
    for article_data in articles:
        try:
            await create_document("articles", article_data)
            print(f"Created article: {article_data['title']}")
        except Exception as e:
            print(f"Error creating article {article_data['title']}: {str(e)}")

async def seed_services():
    """Seed the database with sample services"""
    services = [
        {
            "id": "1",
            "title": "Développement Web",
            "icon": "💻",
            "description": "Création de sites professionnels sur mesure pour entreprises.",
            "features": ["Sites vitrines", "E-commerce", "Applications web", "CMS personnalisés"],
            "price": "À partir de 1500€",
            "active": True
        },
        {
            "id": "2",
            "title": "Maintenance & Réparation",
            "icon": "🔧",
            "description": "Assistance technique et dépannage pour particuliers.",
            "features": ["Diagnostic complet", "Réparation hardware", "Optimisation système", "Support à distance"],
            "price": "À partir de 50€",
            "active": True
        },
        {
            "id": "3",
            "title": "Intelligence Artificielle",
            "icon": "🤖",
            "description": "Conseils sur les outils et technologies IA pour transformer vos données.",
            "features": ["Consultation IA", "Intégration ChatGPT", "Automatisation", "Formation équipes"],
            "price": "Sur devis",
            "active": True
        },
        {
            "id": "4",
            "title": "Montage PC",
            "icon": "🖥️",
            "description": "Conseils personnalisés et montage professionnel pour un PC performant.",
            "features": ["Configuration sur mesure", "Assemblage professionnel", "Tests de performance", "Garantie 2 ans"],
            "price": "À partir de 100€",
            "active": True
        }
    ]
    
    for service_data in services:
        try:
            await create_document("services", service_data)
            print(f"Created service: {service_data['title']}")
        except Exception as e:
            print(f"Error creating service {service_data['title']}: {str(e)}")

async def seed_testimonials():
    """Seed the database with sample testimonials"""
    testimonials = [
        {
            "id": "1",
            "name": "Fabien L",
            "role": "CEO LeCapitole",
            "content": "Je suis extrêmement satisfait des services de Anomalya Corp. Excellent service client, produits de haute qualité, et une expérience globale exceptionnelle. Je recommande vivement !",
            "rating": 5,
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            "active": True
        },
        {
            "id": "2",
            "name": "Tristan S",
            "role": "Particulier",
            "content": "Prix abordable, rapide, fait du bon travail.",
            "rating": 5,
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            "active": True
        },
        {
            "id": "3",
            "name": "Marie Dubois",
            "role": "Directrice Marketing",
            "content": "L'équipe d'Anomalya a transformé notre vision en une réalité numérique exceptionnelle. Leur expertise en IA nous a fait gagner un temps précieux.",
            "rating": 5,
            "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
            "active": True
        }
    ]
    
    for testimonial_data in testimonials:
        try:
            await create_document("testimonials", testimonial_data)
            print(f"Created testimonial: {testimonial_data['name']}")
        except Exception as e:
            print(f"Error creating testimonial {testimonial_data['name']}: {str(e)}")

async def seed_competences():
    """Seed the database with sample competences"""
    competences = [
        {"id": "1", "name": "HTML / CSS", "level": 95, "category": "Frontend"},
        {"id": "2", "name": "JavaScript / React", "level": 90, "category": "Frontend"},
        {"id": "3", "name": "PHP / Laravel", "level": 85, "category": "Backend"},
        {"id": "4", "name": "Python / IA", "level": 88, "category": "IA"},
        {"id": "5", "name": "Sécurité Informatique", "level": 92, "category": "Sécurité"},
        {"id": "6", "name": "MySQL / MongoDB", "level": 87, "category": "Database"},
        {"id": "7", "name": "Cloud & DevOps", "level": 83, "category": "Infrastructure"},
        {"id": "8", "name": "WordPress & CMS", "level": 90, "category": "CMS"}
    ]
    
    for competence_data in competences:
        try:
            await create_document("competences", competence_data)
            print(f"Created competence: {competence_data['name']}")
        except Exception as e:
            print(f"Error creating competence {competence_data['name']}: {str(e)}")

async def seed_faq():
    """Seed the database with sample FAQ"""
    faqs = [
        {
            "id": "1",
            "question": "Quels services proposez-vous ?",
            "answer": "Nous offrons des services de développement web, d'intelligence artificielle, de maintenance & réparation informatique et de montage PC.",
            "active": True
        },
        {
            "id": "2",
            "question": "Comment se déroule la phase de conception ?",
            "answer": "Nous réalisons une analyse approfondie de vos besoins, suivie d'une conception et d'un prototypage. Après validation, nous développons et déployons la solution pour maximiser votre impact en ligne.",
            "active": True
        },
        {
            "id": "3",
            "question": "Proposez-vous un support pour les particuliers ?",
            "answer": "Oui, notre service de maintenance & réparation informatique ainsi que notre service de montage PC sont spécialement conçus pour répondre aux besoins des particuliers.",
            "active": True
        },
        {
            "id": "4",
            "question": "Est-ce que vous assurez la sécurité des données ?",
            "answer": "Absolument, nous appliquons les meilleures pratiques en matière de cybersécurité pour protéger vos données, de l'hébergement au déploiement.",
            "active": True
        }
    ]
    
    for faq_data in faqs:
        try:
            await create_document("faq", faq_data)
            print(f"Created FAQ: {faq_data['question']}")
        except Exception as e:
            print(f"Error creating FAQ {faq_data['question']}: {str(e)}")

async def seed_all_data():
    """Seed all collections with sample data"""
    print("🌱 Starting database seeding...")
    
    await seed_articles()
    await seed_services()
    await seed_testimonials()
    await seed_competences()
    await seed_faq()
    
    print("✅ Database seeding completed!")

if __name__ == "__main__":
    asyncio.run(seed_all_data())