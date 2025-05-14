import React, { useState, useEffect } from "react";
import useTagsApi from "../../Api/TagApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";


function TagSelector({ value, onChange }) {
  const { getAllTags, createTag } = useTagsApi();
  const [tags, setTags] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    getAllTags()
    .then(setTags);
  }, []);

  const saveNew = async () => {
    const tag = await createTag(newName.trim());
    setTags([...tags, tag]);
    onChange(tag.id);
    setAdding(false);
    setNewName("");
  };

  const handleSelectTag = (e) => {
    if (e.target.value === "new") {
      setAdding(true);
    } else {
      onChange(Number(e.target.value));
    }
  }

  return (
    adding ? (
      <div className="d-flex gap-2">
      <input
        placeholder="Tag Name"
        value={newName}
        onChange={e => setNewName(e.target.value)}
      />
      <button onClick={saveNew} className="check-icon">
        <FontAwesomeIcon icon={faCheck} />
      </button>
      <button onClick={() => setAdding(false)} className="cancel-icon">
        <FontAwesomeIcon icon={faX} />
      </button>
    </div>
    ) : (
      <select
      className="tag-select"
      // <-- make sure this is always a string
      value={adding ? "new" : (value ?? "")}
      onChange={handleSelectTag}
    >
      <option value="" disabled>
        Select Tag
      </option>
      {tags.map(t => (
        <option key={t.id} value={t.id + ""}>
          {t.name}
        </option>
      ))}
      <option value="new">+ Add new tag</option>
    </select>
    )
  );

}

export default TagSelector;