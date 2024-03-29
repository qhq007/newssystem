import React, { Fragment, useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
    const [editorState, setEditorstate] = useState("");
    useEffect(() => {
        const html = props.content;
        if(html === undefined) return;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const data = EditorState.createWithContent(contentState);
            setEditorstate(data);
        }
    },[props.content])

    return (
        <Fragment>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => setEditorstate(editorState)}
                onBlur={() => props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))}
            />
        </Fragment>
    )
}
