import React, { use, useEffect } from 'react'
import uniqid from 'uniqid';
import Quill from 'quill';
import { useRef, useState } from 'react';

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showLectureFormFor, setShowLectureFormFor] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write course description here...'
      });
    }
  }, []);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0
              ? chapters.slice(-1)[0].chapterOrder + 1
              : 1,
        };

        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  const handleAddLecture = (chapterId) => {
    const { lectureTitle, lectureDuration, lectureUrl, isPreviewFree } = lectureDetails;
    if (!lectureTitle) return alert('Please enter lecture title');
    const newLecture = {
      id: uniqid(),
      lectureTitle,
      lectureDuration,
      lectureUrl,
      isPreviewFree,
    };
    setChapters(
      chapters.map((ch) =>
        ch.chapterId === chapterId
          ? { ...ch, chapterContent: [...ch.chapterContent, newLecture] }
          : ch
      )
    );
    // reset lecture form
    setLectureDetails({ lectureTitle: "", lectureDuration: "", lectureUrl: "", isPreviewFree: false });
    setShowLectureFormFor(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const description = quillRef.current?.root?.innerHTML || '';
    const payload = {
      courseTitle,
      description,
      coursePrice,
      discount,
      image,
      chapters,
    };
    console.log('Course payload (dev):', payload);
    alert('Course saved to console (dev)');
  };

  useEffect(() => {
    if(!quillRef.current && editorRef) 
    quillRef.current = new Quill(editorRef.current, {
      theme: 'snow',
    });
  }, [editorRef]);
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Course Title</label>
          <input value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="Type here" className="w-full border p-2 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Course Description</label>
          <div ref={editorRef} className="bg-white border rounded-md" style={{ minHeight: 120 }}></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Course Price</label>
            <input type="number" value={coursePrice} onChange={(e) => setCoursePrice(Number(e.target.value))} className="w-full border p-2 rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Course Thumbnail</label>
            <div className="flex items-center gap-2">
              <label htmlFor="thumb" className="inline-flex items-center px-3 py-2 bg-blue-500 text-white rounded cursor-pointer">Upload</label>
              <input id="thumb" type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
              {image && <img src={image} alt="thumb" className="w-20 h-12 object-cover rounded" />}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Discount %</label>
            <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full border p-2 rounded-md" />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-medium mb-2">Chapters</h3>
          <div className="space-y-3">
            {chapters.map((ch) => (
              <div key={ch.chapterId} className="border rounded-md p-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{ch.chapterTitle}</div>
                  <div className="text-sm text-gray-500">{ch.chapterContent.length} Lectures</div>
                </div>
                <div className="mt-2">
                  {!ch.collapsed && (
                    <div>
                      <div className="space-y-2">
                        {ch.chapterContent.map((lec) => (
                          <div key={lec.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div>
                              <div className="text-sm font-medium">{lec.lectureTitle}</div>
                              <div className="text-xs text-gray-500">{lec.lectureDuration}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {showLectureFormFor === ch.chapterId ? (
                        <div className="mt-2 p-2 border rounded bg-gray-50">
                          <input value={lectureDetails.lectureTitle} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })} placeholder="Lecture title" className="w-full border p-2 rounded mb-2" />
                          <div className="grid grid-cols-2 gap-2">
                            <input value={lectureDetails.lectureDuration} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })} placeholder="Duration" className="w-full border p-2 rounded" />
                            <input value={lectureDetails.lectureUrl} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })} placeholder="Video URL" className="w-full border p-2 rounded" />
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <label className="text-sm"><input type="checkbox" checked={lectureDetails.isPreviewFree} onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })} /> Preview free</label>
                            <button type="button" onClick={() => handleAddLecture(ch.chapterId)} className="ml-auto px-3 py-1 bg-blue-500 text-white rounded">Add Lecture</button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 flex gap-2">
                          <button type="button" onClick={() => setShowLectureFormFor(ch.chapterId)} className="px-3 py-1 bg-gray-100 rounded text-sm">+ Add Lecture</button>
                          <button type="button" onClick={() => handleChapter('remove', ch.chapterId)} className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm">Remove</button>
                          <button type="button" onClick={() => handleChapter('toggle', ch.chapterId)} className="px-3 py-1 bg-gray-100 rounded text-sm">Toggle</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <button type="button" onClick={() => handleChapter('add')} className="px-4 py-2 bg-blue-500 text-white rounded">+ Add Chapter</button>
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save Course</button>
        </div>
      </form>
    </div>
  )
}

export default AddCourse