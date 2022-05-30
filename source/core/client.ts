
const HTML_Checklist_Item = `
<div class="w3-cell-row w3-margin w3-padding w3-pale-red" style="width:90%;">
    <div class="w3-cell w3-cell-middle" style="width:30pt;">
        <input class="w3-check" type="checkbox" id="$name" name="$name" onchange="CheckToggle(this)">
    </div>
    <div class="w3-cell w3-cell-middle" >
        <label for="$name"><b>I confirm the above document checks have been made by me.</b></label>
    </div>
</div>
` ;
