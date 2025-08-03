import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <Shield className="h-24 w-24 text-red-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Accès non autorisé</h1>
          <p className="text-gray-400 text-lg">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          
          <div className="text-sm text-gray-500">
            Besoin d'un accès admin ? Contactez un administrateur.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;