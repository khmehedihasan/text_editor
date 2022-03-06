import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
} from 'slate';


import { Button, Toolbar } from './components';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const RichTextExample = () => {
  const [value, setValue] = useState([{
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },]);


  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withReact(createEditor()), [])
  const [input, setInput] = useState();

  useEffect(()=>{
    setInput(document.getElementById('input').innerHTML);

  },[value]);


 



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
        return <li style={{listStyleType:'decimal'}} {...attributes}>{children}</li>
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


    //----------------------------ul----------------------------------
    isUl(editor) {
      const [match] = Editor.nodes(editor, {
        match: n => n.type === 'ul',
      })
  
      return !!match
    },
    toggleUl(editor) {
      const isActive = CustomEditor.isUl(editor)
      Transforms.setNodes(
        editor,
        { type: isActive ? null : 'ul' },
        { match: n => Editor.isBlock(editor, n) }
      )
    },

    //----------------------------ol----------------------------------
    isOl(editor) {
      const [match] = Editor.nodes(editor, {
        match: n => n.type === 'ol',
      })
  
      return !!match
    },
    toggleOl(editor) {
      const isActive = CustomEditor.isOl(editor)
      Transforms.setNodes(
        editor,
        { type: isActive ? null : 'ol' },
        { match: n => Editor.isBlock(editor, n) }
      )
        },



  }

  
  function save(){
    console.log('save')
  }


  return (
    <Slate editor={editor} value={value} onChange={(value) =>{ setValue(value);}}>
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
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleUl(editor)
          }}
        >
          <i className="fas fa-list-ul"></i>
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleOl(editor)
          }}
        >
         <i className="fas fa-list-ol"></i>
        </button>
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        id='input'
        
      />
      {
        <button className='save' onClick={()=>save()}>Save</button>
      }
    </Slate>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  })

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  )

  return !!match
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