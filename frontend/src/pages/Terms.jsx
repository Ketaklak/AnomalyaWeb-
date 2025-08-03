import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, AlertTriangle, Check, Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
            
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Conditions <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">d'Utilisation</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Les conditions générales d'utilisation de nos services numériques et de notre plateforme client.
              </p>
            </div>
          </div>

          <div className="prose prose-invert prose-orange max-w-none">
            {/* Acceptation */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptation des conditions</h2>
              <p className="text-gray-300 mb-4">
                En accédant et en utilisant la plateforme Anomalya Corp, vous acceptez d'être lié par ces conditions d'utilisation. 
                Si vous n'acceptez pas ces termes, veuillez ne pas utiliser nos services.
              </p>
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-orange-300 font-medium mb-1">Important</h4>
                    <p className="text-orange-200 text-sm">
                      Ces conditions peuvent être mises à jour périodiquement. Nous vous notifierons des changements significatifs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">2. Description des services</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Services professionnels</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Développement d'applications web et mobiles</li>
                    <li>• Solutions d'intelligence artificielle</li>
                    <li>• Conseil et expertise IT</li>
                    <li>• Services de cybersécurité</li>
                    <li>• Maintenance et support technique</li>
                    <li>• Formation et accompagnement</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Plateforme client</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Espace client personnalisé</li>
                    <li>• Système de demande de devis</li>
                    <li>• Support technique via tickets</li>
                    <li>• Programme de fidélité</li>
                    <li>• Suivi de projets en temps réel</li>
                    <li>• Accès aux ressources et documentations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Comptes utilisateur */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">3. Comptes utilisateur</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-2" />
                    Création de compte
                  </h3>
                  <div className="ml-7 space-y-3">
                    <p className="text-gray-300">
                      Pour accéder à certains services, vous devez créer un compte avec des informations exactes et à jour.
                    </p>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Vous êtes responsable de maintenir la confidentialité de votre mot de passe</li>
                      <li>• Vous acceptez la responsabilité de toutes les activités sous votre compte</li>
                      <li>• Vous devez notifier immédiatement toute utilisation non autorisée</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-2" />
                    Types de comptes
                  </h3>
                  <div className="ml-7 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <h4 className="text-blue-400 font-medium mb-2">Prospect</h4>
                      <p className="text-gray-300 text-sm">Accès aux informations générales et demandes de contact</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <h4 className="text-blue-400 font-medium mb-2">Client Standard</h4>
                      <p className="text-gray-300 text-sm">Accès complet aux services client et système de fidélité</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg">
                      <h4 className="text-blue-400 font-medium mb-2">Client Premium</h4>
                      <p className="text-gray-300 text-sm">Services prioritaires et fonctionnalités avancées</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Utilisation */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">4. Règles d'utilisation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    Utilisations autorisées
                  </h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Utilisation personnelle ou professionnelle légitime</li>
                    <li>• Demandes de services et support technique</li>
                    <li>• Participation au programme de fidélité</li>
                    <li>• Communication respectueuse avec notre équipe</li>
                    <li>• Téléchargement de ressources fournies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Utilisations interdites
                  </h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Tentatives d'accès non autorisé</li>
                    <li>• Partage de comptes avec des tiers</li>
                    <li>• Utilisation de robots ou scripts automatisés</li>
                    <li>• Transmission de contenu illégal ou malveillant</li>
                    <li>• Violation des droits de propriété intellectuelle</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Programme de fidélité */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">5. Programme de fidélité</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-amber-600/10 border border-amber-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-amber-400 mb-1">Bronze</div>
                    <div className="text-amber-300 text-sm">0 - 499 points</div>
                    <div className="text-amber-200 text-xs mt-2">5% de remise</div>
                  </div>
                  <div className="text-center p-4 bg-gray-400/10 border border-gray-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-gray-300 mb-1">Silver</div>
                    <div className="text-gray-300 text-sm">500 - 1999 points</div>
                    <div className="text-gray-200 text-xs mt-2">10% de remise</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-400/10 border border-yellow-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-300 mb-1">Gold</div>
                    <div className="text-yellow-300 text-sm">2000 - 4999 points</div>
                    <div className="text-yellow-200 text-xs mt-2">15% de remise</div>
                  </div>
                  <div className="text-center p-4 bg-purple-400/10 border border-purple-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-300 mb-1">Platinum</div>
                    <div className="text-purple-300 text-sm">5000+ points</div>
                    <div className="text-purple-200 text-xs mt-2">20% de remise</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Conditions du programme</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Les points sont attribués manuellement par notre équipe technique</li>
                    <li>• Les points n'ont pas de valeur monétaire et ne peuvent être échangés</li>
                    <li>• Les avantages sont applicables uniquement sur nos services</li>
                    <li>• Nous nous réservons le droit de modifier le programme avec préavis</li>
                    <li>• Les points peuvent expirer après 24 mois d'inactivité</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Propriété intellectuelle</h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Tous les contenus présents sur cette plateforme (textes, images, logos, code, design) sont la propriété 
                  d'Anomalya Corp et sont protégés par les lois sur la propriété intellectuelle.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Nos droits</h3>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Marques et logos Anomalya Corp</li>
                      <li>• Code source et applications développées</li>
                      <li>• Documentation et contenus pédagogiques</li>
                      <li>• Design et interface utilisateur</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Vos droits</h3>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Utilisation personnelle des services</li>
                      <li>• Téléchargement des ressources autorisées</li>
                      <li>• Propriété des données que vous nous confiez</li>
                      <li>• Licences d'utilisation des solutions développées</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Responsabilité */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitation de responsabilité</h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Nous nous efforçons de fournir des services de qualité, mais nous ne pouvons garantir une disponibilité 
                  100% ou l'absence complète d'erreurs.
                </p>
                
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <h4 className="text-orange-300 font-medium mb-2">Exclusions de garantie</h4>
                  <ul className="text-orange-200 text-sm space-y-1">
                    <li>• Interruptions temporaires de service pour maintenance</li>
                    <li>• Problèmes liés à votre équipement ou connexion internet</li>
                    <li>• Utilisation de services tiers intégrés</li>
                    <li>• Dommages indirects ou consécutifs</li>
                  </ul>
                </div>
                
                <p className="text-gray-300">
                  Notre responsabilité est limitée au montant des services facturés au cours des 12 derniers mois.
                </p>
              </div>
            </div>

            {/* Résiliation */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Résiliation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Par vous</h3>
                  <p className="text-gray-300 mb-3">
                    Vous pouvez fermer votre compte à tout moment en nous contactant ou depuis votre espace client.
                  </p>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Aucun préavis requis</li>
                    <li>• Conservation des données selon notre politique</li>
                    <li>• Respect des engagements contractuels en cours</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Par nous</h3>
                  <p className="text-gray-300 mb-3">
                    Nous pouvons suspendre ou fermer votre compte en cas de violation des conditions.
                  </p>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Notification préalable sauf cas grave</li>
                    <li>• Possibilité de récupérer vos données</li>
                    <li>• Remboursement proportionnel si applicable</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Droit applicable */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Droit applicable et juridiction</h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Ces conditions d'utilisation sont régies par le droit français. En cas de litige, nous privilégions 
                  la résolution amiable.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-3">Résolution amiable</h3>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Contact direct avec notre service client</li>
                      <li>• Médiation si nécessaire</li>
                      <li>• Délai de réponse : 15 jours ouvrés</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">Juridiction</h3>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Tribunaux compétents de Perpignan</li>
                      <li>• Droit français applicable</li>
                      <li>• Conformité RGPD européen</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Nous contacter</h2>
              <p className="text-orange-200 mb-4">
                Pour toute question concernant ces conditions d'utilisation :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <FileText className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Service Juridique</h3>
                      <p className="text-orange-200 text-sm">legal@anomalya.fr</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Shield className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Support Client</h3>
                      <p className="text-orange-200 text-sm">contact@anomalya.fr</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Anomalya Corp</h4>
                  <div className="text-orange-200 text-sm space-y-1">
                    <p>25 rue des Iris</p>
                    <p>66450 Pollestres, France</p>
                    <p>Tél: 07 83 31 45 14</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dernière modification */}
            <div className="text-center mt-8 p-4 bg-slate-800/30 rounded-lg">
              <p className="text-gray-400 text-sm">
                Dernière modification : Janvier 2025 | Version 1.2
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;