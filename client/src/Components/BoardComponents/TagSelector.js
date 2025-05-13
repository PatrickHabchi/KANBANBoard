import React, { useState, useEffect } from "react";
import useTagsApi from "../../Api/TagApi";


function TagSelector({ value, onChange }) {
  const { getAllTags, createTag } = useTagsApi();
  const [tags, setTags] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  // جلب الوسوم الموجودة
  useEffect(() => {
    getAllTags().then(setTags);
  }, []);

  const saveNew = async () => {
    const tag = await createTag(newName.trim());
    setTags([...tags, tag]);
    onChange(tag.id);
    setAdding(false);
    setNewName("");
  };

  if (adding) {
    return (
      <div>
        <input
          placeholder="اسم الوسم"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button onClick={saveNew}>حفظ</button>
        <button onClick={() => setAdding(false)}>إلغاء</button>
      </div>
    );
  }

  return (
    <select
      value={value || ""}
      onChange={e => {
        if (e.target.value === "__new__") setAdding(true);
        else onChange(Number(e.target.value));
      }}
    >
      <option value="">— اختر وسم —</option>
      {tags.map(t => (
        <option key={t.id} value={t.id}>{t.name}</option>
      ))}
      <option value="__new__">+ إضافة وسم جديد…</option>
    </select>
  );
}

export default TagSelector;