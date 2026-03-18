import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, MessageSquare, Mail, Calendar } from 'lucide-react';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setInquiries(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      await supabase.from('inquiries').delete().eq('id', id);
      fetchInquiries();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Inquiries</h1>
        <p className="text-slate-500 mt-1">Review project requests submitted by potential clients.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700">No Inquiries Found</h3>
          <p className="text-slate-500 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {inquiries.map(inq => (
            <div key={inq.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{inq.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5"><Mail size={14} /> {inq.email}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(inq.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Type</span>
                        <span className="font-medium text-slate-900">{inq.project_type || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Budget</span>
                        <span className="font-medium text-slate-900">{inq.budget || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Timeline</span>
                        <span className="font-medium text-slate-900">{inq.timeline || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Source</span>
                        <span className="font-medium text-slate-900 capitalize">{inq.source?.replace('_', ' ') || 'Direct'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Message</span>
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{inq.message}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleDelete(inq.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent absolute top-6 right-6 md:relative md:top-auto md:right-auto md:mt-1"
                  title="Delete Inquiry"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
