import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Check } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Privacy = () => {
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Politique de <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Confidentialité</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Votre vie privée est importante pour nous. Cette politique explique comment nous collectons, utilisons et protégeons vos données personnelles.
              </p>
            </div>
          </div>

          <div className="prose prose-invert prose-blue max-w-none">
            {/* Introduction */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 mb-4">
                Chez Anomalya Corp, nous nous engageons à protéger et respecter votre vie privée. Cette politique de confidentialité 
                explique quand et pourquoi nous collectons des informations personnelles, comment nous les utilisons, les conditions 
                dans lesquelles nous pouvons les divulguer à des tiers et comment nous les protégeons.
              </p>
              <p className="text-gray-300">
                En utilisant nos services, vous acceptez la collecte et l'utilisation d'informations conformément à cette politique.
              </p>
            </div>

            {/* Données collectées */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">2. Données que nous collectons</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-2" />
                    Informations personnelles
                  </h3>
                  <ul className="text-gray-300 space-y-2 ml-7">
                    <li>• Nom, prénom et informations de contact (email, téléphone, adresse)</li>
                    <li>• Informations de compte (nom d'utilisateur, mot de passe crypté)</li>
                    <li>• Informations professionnelles (entreprise, secteur d'activité, poste)</li>
                    <li>• Préférences de communication et notifications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-2" />
                    Données d'utilisation
                  </h3>
                  <ul className="text-gray-300 space-y-2 ml-7">
                    <li>• Logs de connexion et données de navigation</li>
                    <li>• Demandes de devis et tickets de support</li>
                    <li>• Historique des points de fidélité et transactions</li>
                    <li>• Interactions avec notre plateforme et nos services</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-2" />
                    Données techniques
                  </h3>
                  <ul className="text-gray-300 space-y-2 ml-7">
                    <li>• Adresse IP et données de localisation générale</li>
                    <li>• Type de navigateur et système d'exploitation</li>
                    <li>• Cookies et technologies similaires</li>
                    <li>• Données de performance et d'analyse</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Utilisation des données */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">3. Comment nous utilisons vos données</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">Services principaux</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Gestion de votre compte client</li>
                    <li>• Traitement des demandes de devis</li>
                    <li>• Support technique et assistance</li>
                    <li>• Système de fidélité et récompenses</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">Communication</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Notifications de service</li>
                    <li>• Newsletter et actualités (avec consentement)</li>
                    <li>• Support client et réponse aux demandes</li>
                    <li>• Informations sur nos nouveaux services</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">Amélioration</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Analyse d'utilisation de nos services</li>
                    <li>• Amélioration de l'expérience utilisateur</li>
                    <li>• Développement de nouvelles fonctionnalités</li>
                    <li>• Personnalisation des services</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">Légal</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Respect des obligations légales</li>
                    <li>• Prévention de la fraude</li>
                    <li>• Protection de nos droits</li>
                    <li>• Résolution de litiges</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Partage des données */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Partage des données</h2>
              <p className="text-gray-300 mb-4">
                Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations uniquement dans les cas suivants :
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Avec votre consentement</h3>
                  <p className="text-gray-300">Lorsque vous nous donnez explicitement votre accord pour partager vos informations.</p>
                </div>
                
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Prestataires de services</h3>
                  <p className="text-gray-300">Avec des partenaires de confiance qui nous aident à fournir nos services (hébergement, paiement, support).</p>
                </div>
                
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Obligations légales</h3>
                  <p className="text-gray-300">Quand la loi nous oblige à divulguer certaines informations aux autorités compétentes.</p>
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Sécurité des données</h2>
              <p className="text-gray-300 mb-4">
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Chiffrement</h4>
                    <p className="text-gray-300 text-sm">Toutes les communications sont chiffrées avec TLS/SSL</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Accès limité</h4>
                    <p className="text-gray-300 text-sm">Seul le personnel autorisé peut accéder aux données</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Sauvegarde</h4>
                    <p className="text-gray-300 text-sm">Sauvegardes régulières et sécurisées</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Mise à jour</h4>
                    <p className="text-gray-300 text-sm">Systèmes régulièrement mis à jour et surveillés</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vos droits */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">6. Vos droits (RGPD)</h2>
              <p className="text-gray-300 mb-6">
                Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Droit d'accès</h4>
                      <p className="text-gray-300 text-sm">Consulter vos données personnelles</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Droit de rectification</h4>
                      <p className="text-gray-300 text-sm">Corriger vos données inexactes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Droit à l'effacement</h4>
                      <p className="text-gray-300 text-sm">Demander la suppression de vos données</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Droit à la portabilité</h4>
                      <p className="text-gray-300 text-sm">Récupérer vos données dans un format standard</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Droit d'opposition</h4>
                      <p className="text-gray-300 text-sm">Vous opposer au traitement de vos données</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Droit de limitation</h4>
                      <p className="text-gray-300 text-sm">Limiter le traitement de vos données</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conservation */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Conservation des données</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Données de compte</h3>
                  <p className="text-gray-300">Conservées tant que votre compte est actif, puis 3 ans après fermeture pour les obligations légales.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Données de facturation</h3>
                  <p className="text-gray-300">Conservées 10 ans conformément aux obligations comptables et fiscales.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Logs de connexion</h3>
                  <p className="text-gray-300">Conservés 12 mois pour des raisons de sécurité et de conformité.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Support client</h3>
                  <p className="text-gray-300">Historique conservé 3 ans pour améliorer nos services et résoudre d'éventuels litiges.</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Nous contacter</h2>
              <p className="text-blue-200 mb-4">
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits RGPD :
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Shield className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Délégué à la Protection des Données</h3>
                    <p className="text-blue-200 text-sm">dpo@anomalya.fr</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Check className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Service Client</h3>
                    <p className="text-blue-200 text-sm">contact@anomalya.fr | 07 83 31 45 14</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dernière modification */}
            <div className="text-center mt-8 p-4 bg-slate-800/30 rounded-lg">
              <p className="text-gray-400 text-sm">
                Dernière modification : Janvier 2025
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;