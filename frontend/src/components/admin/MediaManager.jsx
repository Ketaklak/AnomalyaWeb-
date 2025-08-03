import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Upload, 
  Search, 
  Grid, 
  List, 
  Image, 
  Video, 
  File, 
  Download, 
  Trash2, 
  Edit, 
  Copy, 
  Eye,
  Filter,
  Calendar,
  Size,
  RefreshCw,
  Folder,
  FolderPlus
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const MediaManager = ({ 
  onSelectMedia,
  multiSelect = false,
  allowedTypes = ['image', 'video', 'document'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  className = ""
}) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'name' | 'size'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFolder, setCurrentFolder] = useState('');
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const { toast } = useToast();

  // Charger les fichiers média
  const loadMediaFiles = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Remplacer par l'API réelle
      const mockFiles = [
        {
          id: '1',
          name: 'hero-image.jpg',
          type: 'image',
          size: 1024 * 500, // 500KB
          url: '/api/media/hero-image.jpg',
          thumbnail: '/api/media/thumbnails/hero-image.jpg',
          folder: '',
          createdAt: '2025-01-01T10:00:00Z',
          dimensions: { width: 1920, height: 1080 }
        },
        {
          id: '2', 
          name: 'presentation.pdf',
          type: 'document',
          size: 1024 * 1024 * 2, // 2MB
          url: '/api/media/presentation.pdf',
          thumbnail: '/api/media/thumbnails/pdf-icon.png',
          folder: 'documents',
          createdAt: '2025-01-02T14:30:00Z',
        },
        {
          id: '3',
          name: 'demo-video.mp4',
          type: 'video', 
          size: 1024 * 1024 * 15, // 15MB
          url: '/api/media/demo-video.mp4',
          thumbnail: '/api/media/thumbnails/video-thumb.jpg',
          folder: 'videos',
          createdAt: '2025-01-03T09:15:00Z',
          duration: 120 // 2 minutes
        }
      ];
      
      setMediaFiles(mockFiles);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les fichiers média",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Filtrer et trier les fichiers
  useEffect(() => {
    let filtered = mediaFiles.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || file.type === filterType;
      const matchesFolder = currentFolder === '' || file.folder === currentFolder;
      return matchesSearch && matchesType && matchesFolder;
    });

    // Trier
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'date':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredFiles(filtered);
  }, [mediaFiles, searchTerm, filterType, sortBy, sortOrder, currentFolder]);

  // Charger les fichiers au montage
  useEffect(() => {
    loadMediaFiles();
  }, [loadMediaFiles]);

  // Gérer l'upload de fichiers
  const handleFileUpload = useCallback(async (files) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      // Validation du type
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'document';
      
      if (!allowedTypes.includes(fileType)) {
        toast({
          title: "Type non autorisé",
          description: `Le type ${fileType} n'est pas autorisé`,
          variant: "destructive"
        });
        continue;
      }

      // Validation de la taille
      if (file.size > maxFileSize) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse la limite de ${Math.round(maxFileSize / 1024 / 1024)}MB`,
          variant: "destructive"
        });
        continue;
      }

      try {
        setUploadProgress(0);
        
        // Simuler l'upload avec progression
        const uploadPromise = new Promise((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              resolve();
            }
            setUploadProgress(progress);
          }, 200);
        });

        await uploadPromise;

        // Ajouter le fichier à la liste (simulation)
        const newFile = {
          id: Date.now().toString(),
          name: file.name,
          type: fileType,
          size: file.size,
          url: URL.createObjectURL(file),
          thumbnail: fileType === 'image' ? URL.createObjectURL(file) : '/default-thumbnail.png',
          folder: currentFolder,
          createdAt: new Date().toISOString(),
        };

        setMediaFiles(prev => [newFile, ...prev]);
        
        toast({
          title: "Upload réussi",
          description: `${file.name} a été uploadé avec succès`
        });

      } catch (error) {
        toast({
          title: "Erreur d'upload",
          description: `Erreur lors de l'upload de ${file.name}`,
          variant: "destructive"
        });
      }
    }
    
    setUploadProgress(0);
  }, [allowedTypes, maxFileSize, currentFolder, toast]);

  // Sélectionner un fichier
  const handleSelectFile = useCallback((file) => {
    if (multiSelect) {
      setSelectedFiles(prev => {
        const isSelected = prev.find(f => f.id === file.id);
        if (isSelected) {
          return prev.filter(f => f.id !== file.id);
        } else {
          return [...prev, file];
        }
      });
    } else {
      setSelectedFiles([file]);
      onSelectMedia?.(file);
    }
  }, [multiSelect, onSelectMedia]);

  // Supprimer un fichier
  const handleDeleteFile = useCallback(async (fileId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      try {
        // TODO: API call to delete file
        setMediaFiles(prev => prev.filter(f => f.id !== fileId));
        setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
        
        toast({
          title: "Fichier supprimé",
          description: "Le fichier a été supprimé avec succès"
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le fichier",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  // Copier l'URL
  const handleCopyUrl = useCallback((url) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiée",
      description: "L'URL du fichier a été copiée dans le presse-papiers"
    });
  }, [toast]);

  // Créer un dossier
  const handleCreateFolder = useCallback(async () => {
    if (newFolderName.trim()) {
      // TODO: API call to create folder
      setShowNewFolderDialog(false);
      setNewFolderName('');
      toast({
        title: "Dossier créé",
        description: `Le dossier "${newFolderName}" a été créé`
      });
    }
  }, [newFolderName, toast]);

  // Formater la taille de fichier
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Obtenir l'icône selon le type
  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      default: return File;
    }
  };

  return (
    <Card className={`bg-slate-900/50 border-slate-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Gestionnaire de Médias</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="border-slate-600"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadMediaFiles}
              disabled={loading}
              className="border-slate-600"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Barre d'outils */}
        <div className="space-y-4 mb-6">
          {/* Upload */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer">
              <Upload className="h-4 w-4" />
              Uploader des fichiers
              <input
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                accept={allowedTypes.includes('image') ? 'image/*' : '' + 
                        allowedTypes.includes('video') ? ',video/*' : '' +
                        allowedTypes.includes('document') ? ',application/*' : ''}
              />
            </label>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewFolderDialog(true)}
              className="border-slate-600"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Nouveau dossier
            </Button>
          </div>

          {/* Barre de progression d'upload */}
          {uploadProgress > 0 && (
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Recherche et filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher des fichiers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
              >
                <option value="all">Tous les types</option>
                <option value="image">Images</option>
                <option value="video">Vidéos</option>
                <option value="document">Documents</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setSortBy(sort);
                  setSortOrder(order);
                }}
                className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
              >
                <option value="date-desc">Plus récent</option>
                <option value="date-asc">Plus ancien</option>
                <option value="name-asc">Nom A-Z</option>
                <option value="name-desc">Nom Z-A</option>
                <option value="size-desc">Plus volumineux</option>
                <option value="size-asc">Moins volumineux</option>
              </select>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        {currentFolder && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
            <Folder className="h-4 w-4" />
            <button
              onClick={() => setCurrentFolder('')}
              className="hover:text-white"
            >
              Racine
            </button>
            <span>/</span>
            <span className="text-white">{currentFolder}</span>
          </div>
        )}

        {/* Liste des fichiers */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Chargement...</span>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 
            'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4' : 
            'space-y-2'
          }>
            {filteredFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              const isSelected = selectedFiles.find(f => f.id === file.id);

              return viewMode === 'grid' ? (
                <div
                  key={file.id}
                  className={`relative group cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                    isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => handleSelectFile(file)}
                >
                  {/* Thumbnail */}
                  <div className="aspect-square bg-slate-800 rounded-t-lg overflow-hidden">
                    {file.type === 'image' ? (
                      <img
                        src={file.thumbnail}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <div className="text-xs text-white truncate" title={file.name}>
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatFileSize(file.size)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(file.url);
                        }}
                        className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70"
                      >
                        <Copy className="h-3 w-3 text-white" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file.id);
                        }}
                        className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70"
                      >
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={file.id}
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected ? 'bg-blue-500/10 border border-blue-500' : 'bg-slate-800/50 hover:bg-slate-800'
                  }`}
                  onClick={() => handleSelectFile(file)}
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                    {file.type === 'image' ? (
                      <img
                        src={file.thumbnail}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="text-white font-medium">{file.name}</div>
                    <div className="text-gray-400 text-sm">
                      {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(file.url);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.id);
                      }}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sélection multiple */}
        {multiSelect && selectedFiles.length > 0 && (
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-white">
                {selectedFiles.length} fichier(s) sélectionné(s)
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onSelectMedia?.(selectedFiles)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Utiliser la sélection
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedFiles([])}
                  className="border-slate-600"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Dialog nouveau dossier */}
        {showNewFolderDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-600 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">Créer un nouveau dossier</h3>
              
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nom du dossier"
                className="mb-4 bg-slate-700 border-slate-600 text-white"
              />
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewFolderDialog(false);
                    setNewFolderName('');
                  }}
                  className="border-slate-600"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Créer
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaManager;