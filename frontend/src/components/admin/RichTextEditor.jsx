import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  Video,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Eye,
  Edit,
  Save,
  Upload
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const RichTextEditor = ({ 
  content = '', 
  onChange, 
  placeholder = "Commencez à écrire...",
  height = "400px",
  enableImageUpload = true,
  enableVideoEmbed = true,
  enableCodeHighlight = true,
  className = ""
}) => {
  const [editorContent, setEditorContent] = useState(content);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  // Commandes d'édition
  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setEditorContent(editorRef.current.innerHTML);
      onChange?.(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Gestion des raccourcis clavier
  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            execCommand('redo');
          } else {
            execCommand('undo');
          }
          break;
        default:
          break;
      }
    }
  }, [execCommand]);

  // Gestion de la sélection de texte
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setSelectedText(selection.toString());
    }
  }, []);

  // Insérer une image
  const handleImageUpload = useCallback(async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image valide",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      // Convertir l'image en base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = `<img src="${e.target.result}" alt="Image uploadée" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
        execCommand('insertHTML', img);
        toast({
          title: "Succès",
          description: "Image ajoutée avec succès"
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'upload de l'image",
        variant: "destructive"
      });
    }
  }, [execCommand, toast]);

  // Insérer un lien
  const handleInsertLink = useCallback(() => {
    if (linkUrl && linkText) {
      const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      execCommand('insertHTML', link);
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
      toast({
        title: "Succès",
        description: "Lien ajouté avec succès"
      });
    }
  }, [linkUrl, linkText, execCommand, toast]);

  // Insérer du code
  const handleInsertCode = useCallback(() => {
    const code = prompt('Entrez votre code:');
    if (code) {
      const codeHtml = `<pre style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; margin: 10px 0;"><code>${code}</code></pre>`;
      execCommand('insertHTML', codeHtml);
    }
  }, [execCommand]);

  // Insérer une citation
  const handleInsertQuote = useCallback(() => {
    const quote = prompt('Entrez votre citation:');
    if (quote) {
      const quoteHtml = `<blockquote style="border-left: 4px solid #3b82f6; padding-left: 20px; margin: 20px 0; font-style: italic; color: #6b7280;">${quote}</blockquote>`;
      execCommand('insertHTML', quoteHtml);
    }
  }, [execCommand]);

  // Gestion du contenu éditeur
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setEditorContent(newContent);
      onChange?.(newContent);
    }
  }, [onChange]);

  // Toolbar buttons configuration
  const toolbarButtons = [
    { icon: Undo, command: 'undo', tooltip: 'Annuler (Ctrl+Z)' },
    { icon: Redo, command: 'redo', tooltip: 'Refaire (Ctrl+Shift+Z)' },
    { type: 'separator' },
    { icon: Bold, command: 'bold', tooltip: 'Gras (Ctrl+B)' },
    { icon: Italic, command: 'italic', tooltip: 'Italique (Ctrl+I)' },
    { icon: Underline, command: 'underline', tooltip: 'Souligné (Ctrl+U)' },
    { icon: Strikethrough, command: 'strikeThrough', tooltip: 'Barré' },
    { type: 'separator' },
    { icon: Heading1, command: 'formatBlock', value: 'h1', tooltip: 'Titre 1' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', tooltip: 'Titre 2' },
    { icon: Heading3, command: 'formatBlock', value: 'h3', tooltip: 'Titre 3' },
    { type: 'separator' },
    { icon: AlignLeft, command: 'justifyLeft', tooltip: 'Aligner à gauche' },
    { icon: AlignCenter, command: 'justifyCenter', tooltip: 'Centrer' },
    { icon: AlignRight, command: 'justifyRight', tooltip: 'Aligner à droite' },
    { icon: AlignJustify, command: 'justifyFull', tooltip: 'Justifier' },
    { type: 'separator' },
    { icon: List, command: 'insertUnorderedList', tooltip: 'Liste à puces' },
    { icon: ListOrdered, command: 'insertOrderedList', tooltip: 'Liste numérotée' },
    { type: 'separator' },
    { icon: Link, action: () => setShowLinkDialog(true), tooltip: 'Insérer un lien' },
    { icon: Image, action: () => fileInputRef.current?.click(), tooltip: 'Insérer une image', condition: enableImageUpload },
    { icon: Code, action: handleInsertCode, tooltip: 'Insérer du code', condition: enableCodeHighlight },
    { icon: Quote, action: handleInsertQuote, tooltip: 'Insérer une citation' },
  ];

  return (
    <Card className={`bg-slate-900/50 border-slate-700 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Éditeur de Contenu</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={isPreviewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="border-slate-600"
            >
              {isPreviewMode ? <Edit className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {isPreviewMode ? 'Éditer' : 'Aperçu'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Toolbar */}
        {!isPreviewMode && (
          <div className="flex flex-wrap items-center gap-1 p-3 bg-slate-800/50 rounded-lg mb-4 border border-slate-600">
            {toolbarButtons.map((button, index) => {
              if (button.type === 'separator') {
                return <div key={index} className="w-px h-6 bg-slate-600 mx-1" />;
              }

              if (button.condition === false) return null;

              const Icon = button.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (button.action) {
                      button.action();
                    } else {
                      execCommand(button.command, button.value);
                    }
                  }}
                  title={button.tooltip}
                  className="h-8 w-8 p-0 hover:bg-slate-700 text-gray-300 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        )}

        {/* Éditeur / Aperçu */}
        <div className="relative">
          {isPreviewMode ? (
            <div 
              className="min-h-[400px] p-4 bg-white text-gray-900 rounded-lg border border-slate-600 overflow-auto prose prose-lg max-w-none"
              style={{ height }}
              dangerouslySetInnerHTML={{ __html: editorContent }}
            />
          ) : (
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleContentChange}
              onKeyDown={handleKeyDown}
              onMouseUp={handleSelectionChange}
              className="min-h-[400px] p-4 bg-white text-gray-900 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto"
              style={{ height }}
              dangerouslySetInnerHTML={{ __html: editorContent }}
              placeholder={placeholder}
            />
          )}
        </div>

        {/* Input de fichier caché */}
        {enableImageUpload && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageUpload(file);
              }
            }}
            className="hidden"
          />
        )}

        {/* Dialog de lien */}
        {showLinkDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-600 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">Insérer un lien</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Texte du lien
                  </label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Texte à afficher"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLinkDialog(false);
                    setLinkUrl('');
                    setLinkText('');
                  }}
                  className="border-slate-600"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleInsertLink}
                  disabled={!linkUrl || !linkText}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Insérer
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
          <div>
            Caractères: {editorContent.replace(/<[^>]*>/g, '').length}
          </div>
          <div className="flex items-center gap-4">
            {selectedText && (
              <span>Sélectionné: {selectedText.length} caractères</span>
            )}
            <span>Mots: {editorContent.replace(/<[^>]*>/g, '').split(' ').filter(word => word.length > 0).length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;