import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { uploadToR2 } from '../lib/r2';
import { Sparkles, Trash2, Edit2, Plus, Image as ImageIcon } from 'lucide-react';

export default function Portfolio() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Residential',
    year: new Date().getFullYear().toString(),
    location: '',
    description: '',
    features: '',
    img: '',
    gallery: ''
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const handleOpenModal = (project?: any) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || '',
        category: project.category || 'Residential',
        year: project.year || '',
        location: project.location || '',
        description: project.description || '',
        features: Array.isArray(project.features) ? project.features.join(', ') : (project.features || ''),
        img: project.img || '',
        gallery: Array.isArray(project.gallery) ? project.gallery.join(', ') : (project.gallery || '')
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        category: 'Residential',
        year: new Date().getFullYear().toString(),
        location: '',
        description: '',
        features: '',
        img: '',
        gallery: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete project "${title}"?`)) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    
    try {
      const file = e.target.files[0];
      const url = await uploadToR2(file);
      
      if (isGallery) {
        const currentGallery = formData.gallery ? formData.gallery.split(',').map(s => s.trim()).filter(Boolean) : [];
        setFormData({ ...formData, gallery: [...currentGallery, url].join(', ') });
      } else {
        setFormData({ ...formData, img: url });
      }
    } catch (err: any) {
      alert(`Upload failed: ${err.message || "Please check R2 config in .env"}`);
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const dataToSave = {
      title: formData.title,
      category: formData.category,
      year: formData.year,
      location: formData.location,
      description: formData.description,
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
      img: formData.img,
      gallery: formData.gallery.split(',').map(g => g.trim()).filter(Boolean)
    };

    if (editingProject?.id) {
      await supabase.from('projects').update(dataToSave).eq('id', editingProject.id);
    } else {
      await supabase.from('projects').insert([dataToSave]);
    }

    setIsProcessing(false);
    setIsModalOpen(false);
    fetchProjects();
  };

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-slate-500 mt-1">Manage all showcased projects on the main site.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700">No Projects Found</h3>
          <p className="text-slate-500 mt-1">Add your first portfolio project to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map(project => (
            <div key={project.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="size-20 rounded-2xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center">
                {project.img ? (
                  <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} className="text-slate-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg truncate">{project.title}</h3>
                <p className="text-slate-500 text-sm truncate">{project.category} • {project.year} • {project.location}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => handleOpenModal(project)}
                  className="p-3 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(project.id, project.title)}
                  className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-8">{editingProject ? 'Edit Project' : 'New Project'}</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" placeholder="Ocean House" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary">
                    <option>Residential</option>
                    <option>Apartment</option>
                    <option>Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Year</label>
                  <input required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Location</label>
                  <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary resize-none" placeholder="Elaborate on the vision..." />
              </div>

               <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Main Image URL</label>
                <div className="flex gap-2">
                  <input value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" placeholder="https://" />
                  <label className="bg-slate-100 px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors flex items-center justify-center shrink-0 min-w-[120px]">
                    {uploadingImage ? '...' : 'Upload S3'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, false)} disabled={uploadingImage}/>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Gallery URLs (comma separated)</label>
                <div className="flex gap-2">
                  <input value={formData.gallery} onChange={e => setFormData({...formData, gallery: e.target.value})} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" placeholder="url1, url2" />
                  <label className="bg-slate-100 px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors flex items-center justify-center shrink-0 min-w-[120px]">
                    {uploadingImage ? '...' : 'Upload S3'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, true)} disabled={uploadingImage}/>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Features (comma separated)</label>
                <input required value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" placeholder="Custom Millwork, Imported Stone" />
              </div>

              <div className="flex gap-4 pt-6 mt-6 border-t border-slate-100">
                <button type="submit" disabled={isProcessing} className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all flex justify-center items-center gap-2">
                  {isProcessing ? 'Saving...' : <><Sparkles size={18}/> Save Project</>}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 hover:text-slate-900 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
