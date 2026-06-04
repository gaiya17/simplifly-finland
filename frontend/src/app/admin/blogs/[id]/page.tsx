'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Plus, Trash2, GripVertical, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { blogApi, BlogPostData, ContentBlock } from '../../../../lib/blogApi';
import { ImageUpload } from '../../../../components/admin/ImageUpload';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [blog, setBlog] = useState<BlogPostData | null>(null);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const data = await blogApi.getPostBySlug(id);
      setBlog(data);
    } catch (error) {
      toast.error('Failed to load blog');
      router.push('/admin/blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setBlog((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleBlockChange = (index: number, field: string, value: any) => {
    setBlog((prevBlog) => {
      if (!prevBlog) return prevBlog;
      const currentContent = Array.isArray(prevBlog.content) ? prevBlog.content : [];
      const newBlocks = [...currentContent];
      newBlocks[index] = { ...newBlocks[index], [field]: value };
      return { ...prevBlog, content: newBlocks };
    });
  };

  const addBlock = (type: ContentBlock['type']) => {
    if (!blog) return;
    const currentContent = Array.isArray(blog.content) ? blog.content : [];
    setBlog({
      ...blog,
      content: [...currentContent, { type, text: '', items: type === 'list' ? [''] : undefined }],
    });
  };

  const removeBlock = (index: number) => {
    if (!blog) return;
    const currentContent = Array.isArray(blog.content) ? blog.content : [];
    const newBlocks = currentContent.filter((_, i) => i !== index);
    setBlog({ ...blog, content: newBlocks });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (!blog) return;
    const currentContent = Array.isArray(blog.content) ? blog.content : [];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentContent.length) return;

    const newBlocks = [...currentContent];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[newIndex];
    newBlocks[newIndex] = temp;
    
    setBlog({ ...blog, content: newBlocks });
  };

  const saveBlog = async () => {
    if (!blog) return;
    setIsSaving(true);
    try {
      await blogApi.updatePost(id, blog);
      toast.success('Blog saved successfully');
    } catch (error) {
      toast.error('Failed to save blog');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/blogs')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#041d3c]">Edit Blog: {blog.title}</h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Draft ID: {blog.id}</p>
          </div>
        </div>
        <button
          onClick={saveBlog}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#041d3c] text-white hover:bg-[#062c5b] rounded-xl text-sm font-bold transition-all shadow-md disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Editor */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Metadata Section */}
          <div className="bg-white border border-[#eef2f8] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-[#041d3c] border-b border-slate-100 pb-3">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Article Title</label>
                <input
                  type="text"
                  value={blog.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-[#041d3c]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Excerpt / Summary</label>
                <textarea
                  rows={3}
                  value={blog.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-[#041d3c] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Block Editor Section */}
          <div className="bg-white border border-[#eef2f8] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-[#041d3c]">Article Content</h3>
            </div>

            <div className="space-y-4">
              {(Array.isArray(blog.content) ? blog.content : []).map((block, index) => (
                <div key={index} className="flex gap-3 group relative bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all hover:border-blue-300">
                  <div className="flex flex-col gap-2 justify-start shrink-0 text-slate-300">
                    <button onClick={() => moveBlock(index, 'up')} className="hover:text-blue-500" disabled={index === 0}>
                      <GripVertical className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveBlock(index, 'down')} className="hover:text-blue-500" disabled={index === blog.content.length - 1}>
                      <GripVertical className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">
                        {block.type}
                      </span>
                      <button onClick={() => removeBlock(index)} className="text-rose-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {block.type === 'list' ? (
                      <div className="space-y-2">
                        {block.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const newItems = [...(block.items || [])];
                                newItems[i] = e.target.value;
                                handleBlockChange(index, 'items', newItems);
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                              placeholder="List item..."
                            />
                            <button
                              onClick={() => {
                                const newItems = [...(block.items || [])];
                                newItems.splice(i, 1);
                                handleBlockChange(index, 'items', newItems);
                              }}
                              className="text-rose-400 hover:text-rose-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleBlockChange(index, 'items', [...(block.items || []), ''])}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Item
                        </button>
                      </div>
                    ) : block.type === 'image' ? (
                      <div className="space-y-3">
                        <ImageUpload
                          value={block.url || block.text || ''}
                          publicId={block.publicId}
                          onChange={(url, publicId) => {
                            handleBlockChange(index, 'url', url);
                            handleBlockChange(index, 'text', url);
                            handleBlockChange(index, 'publicId', publicId);
                          }}
                          onRemove={() => {
                            handleBlockChange(index, 'url', '');
                            handleBlockChange(index, 'text', '');
                            handleBlockChange(index, 'publicId', '');
                          }}
                          folder="simplifly/blogs/blocks"
                        />
                        <input
                          type="text"
                          value={block.caption || ''}
                          onChange={(e) => handleBlockChange(index, 'caption', e.target.value)}
                          placeholder="Image caption (optional)"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <textarea
                        rows={block.type === 'paragraph' ? 4 : 2}
                        value={block.text || ''}
                        onChange={(e) => handleBlockChange(index, 'text', e.target.value)}
                        placeholder={`Enter ${block.type} text...`}
                        className={`w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none ${
                          block.type === 'heading' ? 'font-bold text-lg' : ''
                        } ${block.type === 'quote' ? 'italic font-serif' : ''}`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Block Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400 mr-2">Add Block:</span>
              <button onClick={() => addBlock('paragraph')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors">Paragraph</button>
              <button onClick={() => addBlock('heading')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors">Heading</button>
              <button onClick={() => addBlock('quote')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors">Quote</button>
              <button onClick={() => addBlock('tip')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors">Tip</button>
              <button onClick={() => addBlock('list')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors">List</button>
              <button onClick={() => addBlock('image')} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg text-xs font-bold text-blue-600 transition-colors">Image</button>
            </div>
          </div>

        </div>

        {/* Right Column: Meta & Assets */}
        <div className="space-y-6">
          
          {/* Post Settings */}
          <div className="bg-white border border-[#eef2f8] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-[#041d3c] border-b border-slate-100 pb-3">Settings</h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
              <select
                value={blog.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
              <select
                value={blog.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="Destinations">Destinations</option>
                <option value="Travel Tips">Travel Tips</option>
                <option value="Guides">Guides</option>
                <option value="Food">Food</option>
                <option value="Experiences">Experiences</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Read Time</label>
              <input
                type="text"
                value={blog.readTime}
                onChange={(e) => handleChange('readTime', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500"
                placeholder="e.g. 5 min read"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tags (comma separated)</label>
              <input
                type="text"
                value={(Array.isArray(blog.tags) ? blog.tags : []).join(', ')}
                onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500"
                placeholder="e.g. Travel, Maldives, Tips"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white border border-[#eef2f8] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-[#041d3c] border-b border-slate-100 pb-3">Cover Image</h3>
            <ImageUpload
              value={blog.image}
              publicId={blog.imagePublicId}
              onChange={(url, publicId) => {
                handleChange('image', url);
                handleChange('imagePublicId', publicId);
              }}
              onRemove={() => {
                handleChange('image', '');
                handleChange('imagePublicId', '');
              }}
              folder="simplifly/blogs"
            />
          </div>

          {/* Author Details */}
          <div className="bg-white border border-[#eef2f8] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-[#041d3c] border-b border-slate-100 pb-3">Author Details</h3>
            
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Author Name</label>
              <input
                type="text"
                value={blog.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Author Role</label>
              <input
                type="text"
                value={blog.authorRole}
                onChange={(e) => handleChange('authorRole', e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500"
                placeholder="e.g. Senior Travel Editor"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Author Avatar</label>
              <ImageUpload
                value={blog.authorAvatar}
                publicId={blog.authorAvatarPublicId}
                onChange={(url, publicId) => {
                  handleChange('authorAvatar', url);
                  handleChange('authorAvatarPublicId', publicId);
                }}
                onRemove={() => {
                  handleChange('authorAvatar', '');
                  handleChange('authorAvatarPublicId', '');
                }}
                folder="simplifly/blogs"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
