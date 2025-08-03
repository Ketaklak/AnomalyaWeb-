import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { adminAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Calendar,
  User,
  Pin,
  Loader2,
  Eye
} from 'lucide-react';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    image: '',
    author: '',
    readTime: '',
    tags: '',
    isPinned: false
  });
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, [searchQuery, selectedCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 50,
        offset: 0
      };
      
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await adminAPI.getArticles(params);
      setArticles(response.data.articles || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      excerpt: '',
      content: '',
      image: '',
      author: '',
      readTime: '',
      tags: '',
      isPinned: false
    });
    setEditingArticle(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleEdit = (article) => {
    setFormData({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      author: article.author,
      readTime: article.readTime,
      tags: article.tags.join(', '),
      isPinned: article.isPinned
    });
    setEditingArticle(article);
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const articleData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingArticle) {
        await adminAPI.updateArticle(editingArticle.id, articleData);
        toast({
          title: "Article mis à jour !",
          description: "L'article a été modifié avec succès.",
        });
      } else {
        await adminAPI.createArticle(articleData);
        toast({
          title: "Article créé !",
          description: "Le nouvel article a été créé avec succès.",
        });
      }

      setIsCreateModalOpen(false);
      resetForm();
      fetchArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      await adminAPI.deleteArticle(articleId);
      toast({
        title: "Article supprimé !",
        description: "L'article a été supprimé avec succès.",
      });
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestion des articles</h1>
            <p className="text-gray-400">Créez et gérez les actualités de votre site</p>
          </div>
          <Button 
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvel article
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-gray-400"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">
                    Toutes les catégories
                  </SelectItem>
                  <SelectItem value="Actualités" className="text-white hover:bg-slate-700">Actualités</SelectItem>
                  <SelectItem value="Technology" className="text-white hover:bg-slate-700">Technology</SelectItem>
                  <SelectItem value="Sécurité" className="text-white hover:bg-slate-700">Sécurité</SelectItem>
                  <SelectItem value="Formation" className="text-white hover:bg-slate-700">Formation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Articles List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Chargement des articles...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{article.title}</h3>
                          {article.isPinned && (
                            <Badge className="bg-red-500/90 text-white">
                              <Pin className="h-3 w-3 mr-1" />
                              Épinglé
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(`/news/${article.id}`, '_blank')}
                            className="border-slate-600 text-gray-300 hover:bg-slate-800"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(article)}
                            className="border-slate-600 text-gray-300 hover:bg-slate-800"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDelete(article.id)}
                            className="border-slate-600 text-gray-300 hover:bg-red-800 hover:border-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                        <Badge variant="secondary" className="bg-slate-800 text-white">
                          {article.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{article.author}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-slate-700 text-gray-300 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {articles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">Aucun article trouvé.</p>
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Titre *
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Catégorie *
                  </label>
                  <Select value={formData.category} onValueChange={handleSelectChange}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="Actualités" className="text-white hover:bg-slate-700">Actualités</SelectItem>
                      <SelectItem value="Technology" className="text-white hover:bg-slate-700">Technology</SelectItem>
                      <SelectItem value="Sécurité" className="text-white hover:bg-slate-700">Sécurité</SelectItem>
                      <SelectItem value="Formation" className="text-white hover:bg-slate-700">Formation</SelectItem>
                      <SelectItem value="Partenariat" className="text-white hover:bg-slate-700">Partenariat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Auteur *
                  </label>
                  <Input
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Temps de lecture
                  </label>
                  <Input
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    placeholder="ex: 5 min"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL *
                </label>
                <Input
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  placeholder="https://..."
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Extrait *
                </label>
                <Textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="bg-slate-800 border-slate-600 text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contenu *
                </label>
                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  className="bg-slate-800 border-slate-600 text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags (séparés par des virgules)
                </label>
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="ex: IA, Innovation, Tech"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isPinned"
                  checked={formData.isPinned}
                  onChange={handleInputChange}
                  className="rounded border-slate-600"
                />
                <label className="text-sm text-gray-300">
                  Épingler cet article
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      {editingArticle ? 'Modification...' : 'Création...'}
                    </>
                  ) : (
                    editingArticle ? 'Modifier' : 'Créer'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="border-slate-600 text-gray-300 hover:bg-slate-800"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminArticles;