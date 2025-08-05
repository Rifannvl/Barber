import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";
import { Trash2, Edit } from "lucide-react";

const ManageBarbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    const { data } = await supabase
      .from("barbers")
      .select("*")
      .order("created_at");
    if (data) setBarbers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = editingId ? "update" : "insert";
    const record = { name, photo_url: photoUrl };
    let query = supabase.from("barbers");
    if (action === "insert") query = query.insert([record]);
    else query = query.update(record).eq("id", editingId);

    const { error } = await query;
    if (error) Swal.fire("Error", "Gagal menyimpan data kapster.", "error");
    else {
      Swal.fire(
        "Sukses!",
        `Kapster berhasil ${editingId ? "diperbarui" : "ditambahkan"}.`,
        "success"
      );
      resetForm();
      fetchBarbers();
    }
  };

  const handleEdit = (barber) => {
    setEditingId(barber.id);
    setName(barber.name);
    setPhotoUrl(barber.photo_url || "");
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Anda yakin?",
      text: "Data kapster akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (isConfirmed) {
      const { error } = await supabase.from("barbers").delete().eq("id", id);
      if (error) Swal.fire("Error", "Gagal menghapus data kapster.", "error");
      else {
        Swal.fire("Dihapus!", "Data kapster telah dihapus.", "success");
        fetchBarbers();
      }
    }
  };

  const resetForm = () => {
    setName("");
    setPhotoUrl("");
    setEditingId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-light-card dark:bg-dark-card/50 p-6 rounded-xl border border-gray-200 dark:border-dark-card">
        <h2 className="font-display text-xl font-bold mb-4">
          {editingId ? "Edit Kapster" : "Tambah Kapster Baru"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 font-semibold">
              Nama
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 bg-light-bg dark:bg-dark-bg rounded border border-gray-300 dark:border-dark-card focus:ring-brand-gold"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="photoUrl" className="block mb-2 font-semibold">
              URL Foto (Opsional)
            </label>
            <input
              type="text"
              id="photoUrl"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full p-2 bg-light-bg dark:bg-dark-bg rounded border border-gray-300 dark:border-dark-card focus:ring-brand-gold"
            />
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-grow p-2 bg-brand-gold text-white font-bold rounded hover:opacity-90"
            >
              {editingId ? "Simpan Perubahan" : "Tambah Kapster"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="p-2 bg-gray-200 dark:bg-dark-card text-dark-text dark:text-light-text font-bold rounded"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="lg:col-span-2 bg-light-card dark:bg-dark-card/50 p-6 rounded-xl border border-gray-200 dark:border-dark-card">
        <h2 className="font-display text-xl font-bold mb-4">Daftar Kapster</h2>
        <div className="space-y-3">
          {(barbers || []).map((barber) => (
            <div
              key={barber.id}
              className="flex items-center justify-between bg-gray-50 dark:bg-dark-card p-3 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    barber.photo_url ||
                    `https://ui-avatars.com/api/?name=${barber.name}&background=B9945A&color=111827`
                  }
                  alt={barber.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="font-semibold text-lg">{barber.name}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(barber)}
                  className="text-gray-500 dark:text-gray-400 hover:text-brand-gold"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(barber.id)}
                  className="text-gray-500 dark:text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageBarbers;
