
function CreateWorkflow( wfClass: string, wfStartData: DataBlock ) : BaseFlow {
    switch ( wfClass ) {
        case "DocumentVerficationWorkflow": return new DocumentVerificationWorkflow( wfStartData, parentWorkflow ) ; 
    }
    throw `function CreateWorkflow :: unknown wfClass "${wfClass}` ;
}
