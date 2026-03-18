/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  Leaf, 
  UserRound, 
  Mail, 
  Phone, 
  MapPin,
  Instagram,
  Menu,
  X
} from 'lucide-react';
import { supabase } from './lib/supabase';

const ProjectModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    projectType: 'Residential',
    budget: 'Under $50k',
    timeline: '1-3 Months',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('inquiries').insert([
        {
          name: formState.name,
          email: formState.email,
          project_type: formState.projectType,
          budget: formState.budget,
          timeline: formState.timeline,
          message: formState.message,
          source: 'project_modal'
        }
      ]);

      if (error) throw error;
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormState({
          name: '',
          email: '',
          projectType: 'Residential',
          budget: 'Under $50k',
          timeline: '1-3 Months',
          message: ''
        });
      }, 2000);
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      alert("Failed to send inquiry. Please view console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-12">
          <div className="mb-10">
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Project Inquiry</span>
            <h2 className="text-3xl font-bold mt-2">Start Your Project</h2>
            <p className="text-slate-500 mt-2">Tell us about your vision and we'll help you bring it to life.</p>
          </div>

          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Inquiry Received!</h3>
              <p className="text-slate-500">We'll be in touch within 24-48 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Jane Doe"
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="jane@example.com"
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Project Type</label>
                  <select 
                    value={formState.projectType}
                    onChange={(e) => setFormState({...formState, projectType: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Hospitality</option>
                    <option>Furniture Only</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Budget Range</label>
                  <select 
                    value={formState.budget}
                    onChange={(e) => setFormState({...formState, budget: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option>Under $50k</option>
                    <option>$50k - $150k</option>
                    <option>$150k - $500k</option>
                    <option>$500k+</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Timeline</label>
                  <select 
                    value={formState.timeline}
                    onChange={(e) => setFormState({...formState, timeline: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option>Immediate</option>
                    <option>1-3 Months</option>
                    <option>3-6 Months</option>
                    <option>6+ Months</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Project Description</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Tell us about your space..."
                  value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Submit Inquiry <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Navbar = ({ onStartProject }: { onStartProject: () => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bg-light/80 backdrop-blur-md border-b border-slate-200 px-6 md:px-20 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
            <Compass size={20} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Sync Interior</h2>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {['Portfolio', 'Services', 'Press', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              {item}
            </a>
          ))}
          <button 
            onClick={onStartProject}
            className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Start Your Project
          </button>
        </nav>

        <button className="md:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-white border-b border-slate-200 p-6 flex flex-col gap-4 md:hidden"
        >
          {['Portfolio', 'Services', 'Press', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-base font-medium text-slate-600"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
          <button 
            onClick={() => {
              setIsOpen(false);
              onStartProject();
            }}
            className="bg-primary text-white w-full py-3 rounded-lg font-bold"
          >
            Start Your Project
          </button>
        </motion.div>
      )}
    </header>
  );
};

const Hero = ({ onStartProject }: { onStartProject: () => void }) => (
  <section className="px-6 md:px-20 py-10">
    <div className="max-w-7xl mx-auto">
      <div 
        className="relative min-h-[600px] rounded-3xl overflow-hidden flex flex-col justify-end p-8 md:p-20 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCf1RLAv7x-bGHDCevyFXGJPY-njDifEt9bcEN7iNsUms7dpRtKMAJnKzHAe2GTOXzfUCAVaNu_unTZlmjF2wlwo2QQmBk-joI_GJ5sIyEq21t4o6bGcHpZjURVDUV1y4nUpcqG_SJ89qm6ZPCl5i4oBlh0DnZwrDCDxb6aEA96g56j43fFpBiP28a1QoLPloL_jjcKVtfCj6vYzOr8RwryIx2rnmc55Og6N-b4XqOQkB_-JZSXGkfj-eEQi1zarTr8WoaMQBkQMbc")` 
        }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6">
            Harmonizing Space and Soul.
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-normal leading-relaxed mb-10">
            Boutique interior design specializing in Japandi and Scandinavian aesthetics for a lifestyle-first approach to modern living.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onStartProject}
              className="bg-primary text-white px-8 py-4 rounded-xl font-bold transition-transform hover:scale-105"
            >
              Start Your Project
            </button>
            <button 
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-xl font-bold hover:bg-white/30 transition-colors"
            >
              View Our Work
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const ProjectDetailModal = ({ project, onClose, onInquire }: { project: any; onClose: () => void; onInquire: () => void }) => {
  const [activeImage, setActiveImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (project) setActiveImage(project.img);
  }, [project]);

  if (!project) return null;

  const allImages = [project.img, ...(project.gallery || [])];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-900 shadow-sm"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Image Gallery Column */}
          <div className="w-full lg:w-3/5 bg-slate-100">
            <div className="sticky top-0">
              <div className="aspect-[16/10] w-full overflow-hidden">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={activeImage || project.img} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-1 p-1">
                {allImages.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img 
                      src={img} 
                      alt={`${project.title} thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="w-full lg:w-2/5 p-8 md:p-12 lg:p-16 bg-white">
            <div className="sticky top-16">
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">{project.category}</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">{project.title}</h2>
              
              <div className="space-y-10">
                <section>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">The Vision</h4>
                  <p className="text-slate-600 leading-relaxed text-lg font-light">
                    {project.description}
                  </p>
                </section>
                
                <section>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Key Features</h4>
                  <ul className="grid grid-cols-1 gap-3">
                    {project.features?.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-3 text-slate-700">
                        <div className="size-1.5 rounded-full bg-primary/40" />
                        <span className="text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Location</h4>
                    <p className="font-medium text-slate-900">{project.location}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Completion</h4>
                    <p className="font-medium text-slate-900">{project.year}</p>
                  </div>
                </section>

                <div className="pt-8">
                  <button 
                    onClick={() => {
                      onClose();
                      onInquire();
                    }}
                    className="w-full bg-primary text-white px-8 py-5 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                  >
                    Inquire About This Design <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const PortfolioManager = ({ projects, onUpdateProjects, onClose }: { 
  projects: any[]; 
  onUpdateProjects: () => void;
  onClose: () => void;
}) => {
  const [editingProject, setEditingProject] = React.useState<any>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setIsProcessing(true);
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        onUpdateProjects();
      } catch (err) {
        console.error("Error deleting:", err);
        alert("Failed to delete project.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSave = async (project: any) => {
    setIsProcessing(true);
    try {
      
      const projectData = {
        title: project.title,
        category: project.category,
        year: project.year,
        location: project.location,
        description: project.description,
        features: project.features.map ? project.features : project.features.split(',').map((f: string) => f.trim()),
        img: project.img,
        gallery: project.gallery.map ? project.gallery : project.gallery.split(',').map((g: string) => g.trim()).filter(Boolean)
      };

      if (editingProject?.id) {
        const { error } = await supabase.from('projects').update(projectData).eq('id', editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([projectData]);
        if (error) throw error;
      }
      onUpdateProjects();
      setIsFormOpen(false);
      setEditingProject(null);
    } catch (err) {
      console.error("Error saving:", err);
      alert("Failed to save project.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold">Portfolio Management</h2>
            <p className="text-slate-500 mt-1">Manage your featured projects and case studies.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                setEditingProject(null);
                setIsFormOpen(true);
              }}
              disabled={isProcessing}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              Add New Project <Sparkles size={18} />
            </button>
            <button 
              onClick={onClose}
              disabled={isProcessing}
              className="bg-slate-100 text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              Exit Admin
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {projects.map((project) => (
            <div key={project.title} className="flex items-center gap-6 p-6 bg-bg-light rounded-3xl border border-slate-100">
              <div className="size-24 rounded-2xl overflow-hidden shrink-0">
                <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{project.title}</h3>
                <p className="text-slate-500 text-sm">{project.category} • {project.year} • {project.location}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setEditingProject(project);
                    setIsFormOpen(true);
                  }}
                  className="p-3 bg-white text-slate-600 rounded-xl hover:text-primary transition-colors border border-slate-200"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(project.id, project.title)}
                  disabled={isProcessing}
                  className="p-3 bg-white text-red-500 rounded-xl hover:bg-red-50 transition-colors border border-slate-200 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isFormOpen && (
        <ProjectFormModal 
          project={editingProject} 
          onSave={handleSave} 
          onClose={() => {
            setIsFormOpen(false);
            setEditingProject(null);
          }} 
        />
      )}
    </div>
  );
};

const ProjectFormModal = ({ project, onSave, onClose }: { project?: any; onSave: (p: any) => void; onClose: () => void }) => {
  const [formData, setFormData] = React.useState(project || {
    title: '',
    category: 'Residential',
    year: '2024',
    location: '',
    description: '',
    features: [],
    img: '',
    gallery: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto p-8 md:p-12"
      >
        <h2 className="text-2xl font-bold mb-8">{project ? 'Edit Project' : 'New Project'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Title</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Category</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option>Residential</option>
                <option>Apartment</option>
                <option>Commercial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Year</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                value={formData.year}
                onChange={e => setFormData({...formData, year: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Location</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</label>
            <textarea 
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Main Image URL</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
              value={formData.img}
              onChange={e => setFormData({...formData, img: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Features (comma separated)</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
              value={Array.isArray(formData.features) ? formData.features.join(', ') : formData.features}
              onChange={e => setFormData({...formData, features: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Gallery Image URLs (comma separated)</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
              value={Array.isArray(formData.gallery) ? formData.gallery.join(', ') : formData.gallery}
              onChange={e => setFormData({...formData, gallery: e.target.value})}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all">
              Save Project
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 text-slate-900 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const FeaturedProjects = ({ projects, onInquire }: { projects: any[]; onInquire: () => void }) => {
  const [selectedProject, setSelectedProject] = React.useState<any>(null);
  const [activeCategory, setActiveCategory] = React.useState('All');

  const categories = ['All', 'Residential', 'Apartment', 'Commercial'];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className="px-6 md:px-20 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Curated Selection</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Featured Projects</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {filteredProjects.map((project, i) => (
            <motion.div 
              layout
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100">
                <img 
                  src={project.img} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white text-primary p-4 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <ArrowRight size={24} />
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <h3 className="font-bold text-lg">{project.title}</h3>
                <p className="text-slate-500 text-sm">{project.category}, {project.year}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400">No projects found in this category.</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-2 text-primary font-bold hover:underline group">
            Browse All Projects <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      <ProjectDetailModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        onInquire={onInquire}
      />
    </section>
  );
};

const Essence = () => {
  const features = [
    {
      icon: <Sparkles className="text-primary" size={28} />,
      title: "Functional Minimalism",
      desc: "Every element in our design serves a purpose, eliminating visual noise to foster a sense of tranquility."
    },
    {
      icon: <Leaf className="text-primary" size={28} />,
      title: "Natural Materials",
      desc: "Sustainable woods, organic textures, and earthy palettes that bring the grounding energy of nature indoors."
    },
    {
      icon: <UserRound className="text-primary" size={28} />,
      title: "Human-Centric Design",
      desc: "Spaces are curated around the way you live, breathe, and move—creating a seamless flow for daily life."
    }
  ];

  return (
    <section id="services" className="bg-white px-6 md:px-20 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Our Essence</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 max-w-3xl mx-auto leading-tight">
            A 'lifestyle-first' approach to interior design.
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            We believe your home should be a reflection of your inner peace. We blend the functional rigor of Scandinavian design with the serene minimalism of Japanese aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-3xl bg-bg-light border border-slate-100 hover:border-primary/20 transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-8 transition-transform group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Press = () => {
  const mentions = [
    {
      publication: "Architectural Digest",
      title: "The New Wave of Japandi Minimalism",
      date: "Oct 2023"
    },
    {
      publication: "Elle Decor",
      title: "Sync Interior: Harmonizing Scandinavian and Japanese Styles",
      date: "Jan 2024"
    },
    {
      publication: "Vogue Living",
      title: "Boutique Design for Modern Living",
      date: "Feb 2024"
    },
    {
      publication: "Design Anthology",
      title: "Crafting Serenity in Urban Spaces",
      date: "Mar 2024"
    }
  ];

  return (
    <section id="press" className="px-6 md:px-20 py-24 bg-bg-light">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Media Mentions</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4">In The Press</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mentions.map((mention, i) => (
            <motion.div 
              key={mention.publication}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer p-8 bg-white rounded-2xl border border-slate-100 hover:shadow-xl hover:shadow-primary/5 transition-all"
            >
              <p className="text-primary font-bold text-xs uppercase tracking-widest mb-4">{mention.publication}</p>
              <h3 className="text-lg font-bold mb-6 group-hover:text-primary transition-colors leading-snug">"{mention.title}"</h3>
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>{mention.date}</span>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('inquiries').insert([
        {
          name: formState.name,
          email: formState.email,
          subject: formState.subject,
          message: formState.message,
          source: 'contact_form'
        }
      ]);

      if (error) throw error;
      
      setIsSuccess(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error("Error submitting contact form:", err);
      alert("Failed to send message. Please view console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="px-6 md:px-20 py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Get In Touch</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-8 leading-tight">Let's discuss your next project.</h2>
            <p className="text-slate-600 text-lg mb-12 max-w-md">
              Whether you're looking to redesign a single room or an entire property, we're here to help you create your sanctuary.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-1">Email Us</h4>
                  <p className="text-lg font-medium">hello@syncinterior.com</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-1">Call Us</h4>
                  <p className="text-lg font-medium">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-1">Visit Us</h4>
                  <p className="text-lg font-medium">Copenhagen & Tokyo</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-light p-8 md:p-12 rounded-[2rem] border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Your name"
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email</label>
                  <input 
                    required
                    type="email" 
                    placeholder="Your email"
                    value={formState.email}
                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Subject</label>
                <input 
                  required
                  type="text" 
                  placeholder="How can we help?"
                  value={formState.subject}
                  onChange={(e) => setFormState({...formState, subject: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Message</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Tell us about your project..."
                  value={formState.message}
                  onChange={(e) => setFormState({...formState, message: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <button 
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${isSuccess ? 'bg-emerald-600' : 'bg-primary hover:opacity-90'}`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSuccess ? (
                  <>Message Sent!</>
                ) : (
                  <>Send Message <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = ({ onStartProject }: { onStartProject: () => void }) => (
  <section className="px-6 md:px-20 py-20 bg-bg-light">
    <div className="max-w-7xl mx-auto bg-primary rounded-[2.5rem] p-10 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-10">
      <div className="max-w-xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Ready to transform your space?</h2>
        <p className="text-white/80 text-lg">Let's create a sanctuary that reflects your lifestyle and values.</p>
      </div>
      <button 
        onClick={onStartProject}
        className="bg-white text-primary px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
      >
        Get Started
      </button>
    </div>
  </section>
);

const Footer = ({ onOpenAdmin }: { onOpenAdmin: () => void }) => (
  <footer className="bg-slate-950 text-white px-6 md:px-20 pt-20 pb-10">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-6 flex items-center justify-center bg-primary rounded text-white">
              <Compass size={14} />
            </div>
            <h2 className="text-lg font-bold">Sync Interior</h2>
          </div>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Crafting serene, functional spaces that blend the best of Japanese and Scandinavian design philosophy.
          </p>
          <button 
            onClick={onOpenAdmin}
            className="mt-8 text-[10px] uppercase tracking-widest text-white/20 hover:text-white/60 transition-colors"
          >
            Admin Access
          </button>
        </div>

        <div>
          <h4 className="font-bold mb-8 uppercase text-[10px] tracking-[0.3em] text-primary">Quick Links</h4>
          <ul className="space-y-4 text-sm text-white/60">
            {['Portfolio', 'Our Story', 'Design Process', 'Journal'].map(link => (
              <li key={link}><a href={`#${link.toLowerCase().replace(' ', '-')}`} className="hover:text-white transition-colors">{link}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-8 uppercase text-[10px] tracking-[0.3em] text-primary">Services</h4>
          <ul className="space-y-4 text-sm text-white/60">
            {['Residential Design', 'Commercial Spaces', 'Custom Furniture', 'Consultation'].map(link => (
              <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-8 uppercase text-[10px] tracking-[0.3em] text-primary">Contact</h4>
          <ul className="space-y-5 text-sm text-white/60">
            <li className="flex items-center gap-3"><Mail size={16} className="text-primary" /> hello@syncinterior.com</li>
            <li className="flex items-center gap-3"><Phone size={16} className="text-primary" /> +1 (555) 123-4567</li>
            <li className="flex items-center gap-3"><MapPin size={16} className="text-primary" /> Copenhagen & Tokyo</li>
          </ul>
        </div>
      </div>

      <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-white/30 text-[11px] uppercase tracking-widest">
        <p>© 2024 Sync Interior Design. All rights reserved.</p>
        <div className="flex gap-10">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
            <Instagram size={14} /> Instagram
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isAdminOpen, setIsAdminOpen] = React.useState(false);
  const [projects, setProjects] = React.useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = React.useState(true);

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleUpdateProjects = async (newProjects: any[]) => {
    // This is handled individually now, so no need to replace the whole array.
    // fetchProjects();
  };

  return (
    <div className="min-h-screen">
      <Navbar onStartProject={() => setIsModalOpen(true)} />
      <main>
        <Hero onStartProject={() => setIsModalOpen(true)} />
        {loadingProjects ? (
           <div className="py-20 text-center text-slate-500">Loading projects...</div>
        ) : (
          <FeaturedProjects projects={projects} onInquire={() => setIsModalOpen(true)} />
        )}
        <Essence />
        <Press />
        <CTA onStartProject={() => setIsModalOpen(true)} />
        <Contact />
      </main>
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {isAdminOpen && (
        <PortfolioManager 
          projects={projects} 
          onUpdateProjects={fetchProjects} 
          onClose={() => setIsAdminOpen(false)} 
        />
      )}
    </div>
  );
}
