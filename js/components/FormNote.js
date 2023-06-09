import { Params } from "../helpers/Params.js"

import Message from "./Message.js"

import getDataNote from "../data/getDataNote.js"
import setDataNote from "../data/setDataNote.js"

import ChangeInputValue from "../helpers/ChangeInputValue.js"
import PickerCategory from "./PickerCategory.js"
import OpcFormNote from "./OpcFormNote.js"

const FormNote = async ()=>{
    
    const params    = Params()
    const type      = params[1] || ''
    const id        = params[2] || ''

    const lstNotes = JSON.parse( localStorage.getItem( 'Notes' ) ) 
    const lstNotesOffline = lstNotes.offline.filter( data => data.id !== id && data )

    const Data = {
        btnBack : type === 'add' || type === 'edit' ? '#' : `#list/${ type }`,
        btnSubmit : type === 'add' || type === 'edit' || type === 'offline',
        time : Date.now(),
        
        data : {}
    }

    document.getElementById( 'root' ).innerHTML = (`
        <form class="form__zWDsn form-${ Data.time }" >
            <div class="div__OkY6P" >
                <span class="span__j6i6j" ></span>
            </div>
        </form>
    `)

    const $Element = document.querySelector( `.form__zWDsn.form-${ Data.time }` ) 
    const [ data = false ] = await getDataNote( type, id ) 

    if( data || type === 'add' ){
        $Element.innerHTML = (`
            <input type="text" class="inputIDCategory" name="idCategory" hidden>
            ${ type !== 'offline' && type !== 'add' ? `<input name="id" readonly hidden>` : '' }
            <header class="header__EYmvy" >
                <button type="button" class="button__fe9vD after refHO97dZ5ftYY7R6rhb" data-action="Back" ><i class="fa-solid fa-arrow-left"></i></button>
                <div class="div__FZtoc" >  

                    ${ Data.btnSubmit ? `
                        <button type="button" class="button__rVr92 after yTbryS53mH1f7Ne" data-action="category" ><i class="fa-solid fa-tag"></i></button>
                    ` : '' }

                    ${ type !== 'add' && type !== 'offline' ? `
                        <button type="button" class="button__rVr92 after yTbryS53mH1f7Ne" data-action="option" ><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    ` : ''} 

                </div>
            </header>
            <input type="text" class="input__RgGQ3" spellcheck="false" name="title" placeholder="titulo" readonly />
            <textarea class="textarea__yQsTw scrollbarY" spellcheck="false" name="details" placeholder="escriba algo" readonly ></textarea>
        `)
    } else {
        Message(`
            <h3>El elemento no Existe o ha Sido Eliminado</h3>
            <img src="./img/icons/no-content.png" alt="">
        `)
    }
 
    ChangeInputValue( $Element , data )

    if( ( Data.btnSubmit && data ) || type === 'add' ){

        data.id = id
        data.title = data.title || ''
        data.details = data.details || ''
    
        $Element.title.readOnly = false 
        $Element.details.readOnly = false
        
        Data.data = JSON.parse( JSON.stringify( data ) )
        
    }


    $Element.addEventListener( 'input', ( { target } )=>{
    
        const _name = target.name 
    
        if( _name === 'title' || _name === 'details' ){
            data[ _name ] = target.value  
    
            if( data.title !== '' || data.details !== '' ){ 
                lstNotes.offline = [ ...lstNotesOffline, {
                    id: id,
                    title : data.title,
                    details: data.details,
                    dateLocal : Data.time
                } ] 
            }
    
            else lstNotes.offline = lstNotesOffline
    
            if( type !== 'offline' && type !== 'add' )
                if( JSON.stringify( Data.data ) === JSON.stringify( data )  )
                    lstNotes.offline = lstNotesOffline 
            
            localStorage.setItem( 'Notes', JSON.stringify( lstNotes ) ) 
        }
    
    })

    $Element.addEventListener( 'click', ({ target }) =>{

        if( target.classList.contains( 'refHO97dZ5ftYY7R6rhb' ) ){ 
                
            setDataNote( type === 'offline' || type === 'add' ? 'add' : 'update', data )
                .then( () => ( location.hash = Data.btnBack ) )
    
        }

        if( target.classList.contains( 'yTbryS53mH1f7Ne' ) ){
            if( target.dataset.action === 'category' ){
                return PickerCategory({
                    idCategory : $Element.idCategory.value,
                    changeIdCategory : ( idCategory )=> {
                        $Element.idCategory.value = idCategory
                        data.idCategory = idCategory
                    }
                })
            }

            else if( target.dataset.action === 'option' ){
                return OpcFormNote( type, data )
            }
        }
    
    } )

    $Element.addEventListener( 'submit', e => { 
        e.preventDefault() 
        setDataNote( type === 'offline' || type === 'add' ? 'add' : 'update', data )
            .then( () => ( location.hash = Data.btnBack ) )
    
    })


    //${ Data.btnSubmit ? `<button type="submit" class="button__rVr92 after" data-action="Back" ><i class="fa-solid fa-check"></i></button>` : '' }
 
}

export default FormNote
 
