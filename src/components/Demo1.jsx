import React, { useCallback, useMemo, useState } from 'react';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import {
  Editor,
  Transforms,
  createEditor,
} from 'slate';


import { Button, Toolbar } from './components';


const RichTextExample = () => {
  const [value, setValue] = useState([{
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },]);



  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withReact(createEditor()), [])



  //----------------------------------Custom Element----------------------------------

  const Element = ({ attributes, children, element }) => {
    switch (element.type) {
      case 'h1':
        return <h1 {...attributes}>{children}</h1>
  
      case 'h2':
        return <h2 {...attributes}>{children}</h2>
  
      case 'h3':
        return <h3 {...attributes}>{children}</h3>
  
      case 'ul':
        return <li {...attributes}>{children}</li>
  
      case 'ol':
        return <ol {...attributes}>{children}</ol>
  
      default:
        return <p {...attributes}>{children}</p>
    }
  }

  const CustomEditor = {
    //----------------------------h1----------------------------------
    isH1(editor) {
      const [match] = Editor.nodes(editor, {
        match: n => n.type === 'h1',
      })
  
      return !!match
    },
    toggleH1(editor) {
      const isActive = CustomEditor.isH1(editor)
      Transforms.setNodes(
        editor,
        { type: isActive ? null : 'h1' },
        { match: n => Editor.isBlock(editor, n) }
      )
    },

    //----------------------------h2----------------------------------
    isH2(editor) {
      const [match] = Editor.nodes(editor, {
        match: n => n.type === 'h2',
      })
  
      return !!match
    },
    toggleH2(editor) {
      const isActive = CustomEditor.isH2(editor)
      Transforms.setNodes(
        editor,
        { type: isActive ? null : 'h2' },
        { match: n => Editor.isBlock(editor, n) }
      )
    },


    //----------------------------h3----------------------------------
    isH3(editor) {
      const [match] = Editor.nodes(editor, {
        match: n => n.type === 'h3',
      })
  
      return !!match
    },
    toggleH3(editor) {
      const isActive = CustomEditor.isH3(editor)
      Transforms.setNodes(
        editor,
        { type: isActive ? null : 'h3' },
        { match: n => Editor.isBlock(editor, n) }
      )
    },

  }


  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Toolbar>
        <MarkButton format="bold" icon={<i className="fas fa-bold"></i>} />
        <MarkButton format="italic" icon={<i className="fas fa-italic"></i>} />
        <MarkButton format="underline" icon={<i className="fas fa-underline"></i>} />
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleH1(editor)
          }}
        >
          H1
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleH2(editor)
          }}
        >
          H2
        </button>

        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleH3(editor)
          }}
        >
          H3
        </button>
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        
      />
    </Slate>
  )
}


const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}


const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}


const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}


const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      {icon}
    </Button>
  )
}


export default RichTextExample;