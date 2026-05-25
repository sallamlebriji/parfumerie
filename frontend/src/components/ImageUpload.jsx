const ImageUpload = ({ onChange, preview }) => (
  <label className="block">
    <span className="parfum-label">Image produit</span>
    <div className="rounded-[24px] border border-dashed border-[#D8B87E]/50 bg-[#FFF5E7]/70 p-5 text-center">
      {preview ? (
        <img src={preview} alt="Preview" className="mx-auto mb-4 aspect-square w-44 rounded-[22px] border border-[#D8B87E]/25 object-cover shadow-[0_18px_45px_rgba(82,55,37,0.12)]" />
      ) : (
        <div className="mx-auto mb-4 grid aspect-square w-44 place-items-center rounded-[22px] border border-[#D8B87E]/25 bg-[#FFFDF8] text-sm font-bold text-[#9E8C7E]">
          Preview
        </div>
      )}
      <input className="parfum-field bg-white" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => onChange(e.target.files[0])} />
      <p className="mt-3 text-xs font-semibold text-[#9E8C7E]">JPG, PNG ou WEBP. Taille limite: 3 Mo.</p>
    </div>
  </label>
);

export default ImageUpload;
