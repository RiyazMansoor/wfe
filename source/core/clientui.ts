function Build_Checklist_Form( jfrm ) {
    const frmData = JSON.parse( jfrm.attr( "rm-data" ) ) ;
    const frmChecklist = $( HTML_Checklist_Form ) ;
    frmChecklist.find( "#checklist_title" ).text( frmData.title ) ;
    const frmChecklistItems = frmChecklist.find( "#checklist_items" ) ;
    for ( const [ name, text ] of Object.entries( frmData.checks ) ) {
        frmChecklistItems.append( _Checklist_Item( name, text ) ) ;
    }
    jfrm.html( frmChecklist ) ;
}

const HTML_Checklist_Form = `
<div class="w3-container w3-cell-row w3-theme-d2 w3-large" stylex="padding-right:18pt;">
    <div class="w3-cell w3-cell-middle">
        <b id="checklist_title">$title - Verification Checklist</b>
    </div>
    <div class="w3-cell w3-cell-middle w3-right-align">
        <button class="w3-button w3-theme" onclick="SaveForm(this)">Save &#9851;</button>
        <button class="w3-button w3-theme" onclick="SubmitForm(this)">Submit &#9654;</button>
    </div>
</div>
<div style="padding:2pt;padding-top:0pt;" class="w3-theme-d2">
    <div class="w3-padding-large w3-white">
        <br/>
        <div id="checklist_items" />
        <br/>
    </div>
</div>
` ;

const HTML_Checklist_Item = `
<div class="w3-cell-row w3-margin w3-padding w3-pale-red" style="width:90%;">
    <div class="w3-cell w3-cell-middle" style="width:30pt;">
        <input class="w3-check" type="checkbox" id="$name" name="$name" onchange="Checklist_Item_Toggle(this)">
    </div>
    <div class="w3-cell w3-cell-middle" >
        <label for="$name"><b>I confirm the above document checks have been made by me.</b></label>
    </div>
</div>
` ;

function _Checklist_Item( name: string, text: string ) : object {
    const checklist_item = $( HTML_Checklist_Item ) ;
    const checkbox = checklist_item.find( "input" ) ;
    checkbox.attr( "id", name ) ;
    checkbox.attr( "name", name ) ;
    const label = checklist_item.find( "label" ) ;
    label.attr( "for", name ) ;
    label.html( text ) ;
    return checklist_item ;
}

function Checklist_Item_Toggle( chk ) {
    const checked = $( chk ).is(":checked") ;
    const div = $( chk ).parent().parent();
    if ( checked ) {
      div.removeClass( "w3-pale-red" ) ;
      div.addClass( "w3-pale-green" ) ;
    } else {
      div.removeClass( "w3-pale-green" ) ;
      div.addClass( "w3-pale-red" ) ;
    }
  }

