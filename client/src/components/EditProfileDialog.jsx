import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditProfileDialog = ({ isOpen, onClose, onSave, currentData }) => {
    const [formData, setFormData] = useState(currentData);

    useEffect(() => {
        setFormData(currentData);
    }, [currentData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 rounded-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-6">Edit Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="relative cursor-pointer flex flex-col items-center gap-y-2">Avatar
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setFormData({ ...formData, avatar: URL.createObjectURL(e.target.files[0]) })}
                            />
                            <div className="w-32 h-32 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-gray-700">
                                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={formData.uname}
                            onChange={(e) => setFormData({ ...formData, uname: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                            placeholder="johndoe123"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileDialog;