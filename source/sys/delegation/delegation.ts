
/**
 * Type structure for access role information.
 * The primary key is @roleKey
 * Note: audit information in logs.
 * @roleKey The role id and name.
 * @roleDescription The description of the role.
 * @isActive The status of the role, active or not.
 */
 type T_RoleRecord = {
    roleKey: T_RoleKey,
    roleDescription: string,
    isActive: boolean
}

/**
 * Interface to interact with type structure T_RoleRecord for sys admins.
 * Creation of roles in the system, system wide role enabling or disabling
 */
interface I_RoleRecord {

    /**
     * Returns the matching role data structure.
     * @param roleKey The role id and name.
     * @returns undefined if not found, else the role data structure.
     */
    get(roleKey: T_RoleKey): T_RoleRecord | undefined ;

    /**
     * Returns the array matching role data structures.
     * @param str The partial search string.
     * @returns The array of matching role data structures.
     */
    search(str: string): T_RoleRecord[] ;

    /**
     * Creates a new role that is already active.
     * @throws Exception if the @roleKey already exists.
     * @param roleKey The role id and name.
     * @param roleDesc The description of the role. 
     * @returns The role data structure.
     */
    add(roleKey: T_RoleKey, roleDesc: string): T_RoleRecord ;

    /**
     * Enables the specified role.
     * @param roleKey The role id and name.
     * @returns The role data structure.
     */
    enable(roleKey: T_RoleKey): T_RoleRecord ;

    /**
     * Disables the specified role.
     * @param roleKey The role id and name.
     * @returns The role data structure.
     */
    disable(roleKey: T_RoleKey): T_RoleRecord ;

}

/**
 * Enumeration of types of organizations.
 */
enum E_OrgType {
    COMPANY, PARTNERSHIP, COOPERATIVE, SOLE_PROPRIETOR,
    ISLAND_COUNCIL, ATOLL_COUNCIL, CITY_COUNCIL,
    HIGHER_COURTS, LOWER_COURTS, MAGISTRATE_COURTS, 
    MINISTRIES, INDEPENDENT_INSTITUTIONS,
    // special bodies - eg:created via laws
    PO, PARLIAMENT, LGA, MIRA, MCS
}

/**
 * The name of an organization.
 */
type T_OrgName = string ;

/**
 * Type structure to get the legally accountable person for an organization.
 * Not all organizations have APIs to automatically process requests,
 * so a backup table is necessary. Further, this table will be used 
 * activate and deactivate API calls for any technical reason - to fall back
 * on last access credentials in the table.
 * Note: audit information in logs.
 * @orgType The type of the organization.
 * @orgId The organizations identifier.
 * @accountableIndId An legally accountable person for the organization.
 * @admins The array of administrators assigned by the accountable person for the organization.
 * @accountableIndAPI API options to get accountable person from an API.
 *      @apiActive The switch to enable and disable API calls for accountable person.
 *      @apiParamsAsJSON The json object or required API parameters for accountable person.
 *      @apiLastCalled The means to control excessive API calls for accountable person.
 */
type T_AccountablePerson = {
    orgType: E_OrgType,
    orgId: T_OrgId,
    orgName: T_OrgName,
    accountableIndId: T_IndId,
    admins: T_IndId[],
    accountableIndAPI: {
        apiActive: boolean,
        apiParamsAsJSON: string,
        apiLastCalled: T_Timestamp
    }
}

/**
 * Interface to dynamically get an organizations legally accountable person.
 * This interface is strictly for the accountable person.
 * @see T_AccountablePerson
 */
 interface I_AccountablePersonAssigned {

    /**
     * Returns the array of organiations for the supplied accountable individual.
     * @param accountableIndId The legally accountable person for the organization.
     * @return The array of organizations.
     */
    getOrgs(accountableIndId: T_IndId): T_OrgId[] ;

    /**
     * Returns the array of currently assigned admins in the supplied organization.
     * @see setorgAdmin
     * @param orgId The organizations identifier.
     * @return The array of admins currently assigned to this organization.
     */
    getOrgAdmins(orgId: T_OrgId): T_IndId[] ;

    /**
     * Sets an admin for this organization.
     * @param orgId The organizations identifier.
     * @param index Array position of the admin.
     * @param adminIndId The individual identifier of the assigned admin.
     */
    setOrgAdmin(orgId: T_OrgId, index: number, adminIndId: T_IndId): void;

}

/**
 * Interface to dynamically get an organizations legally accountable person.
 * This is a sys admin level service.
 * @see T_AccountablePerson
 */
 interface I_AccountablePersonAssigner {

    /**
     * Returns the legally accountable person data structure for the supplied organiation.
     * The caller can modify the parameters as required.
     * @param orgId The organizations identifier.
     * @return The legally accountable person data structure.
     */
    get(orgId: T_OrgId): T_AccountablePerson ;

    /**
     * Saves the data structure to the data store.
     * @param oap The data structure to save.
     */
    save(oap: T_AccountablePerson): void ;

}

/**
 * Type structure for individuals (executors) who front for other individials or organizations.
 * This service is only available for public services, NOT for regulatory/internal/workflow operations.
 * The responsibility of ensuring only authorized individuals are impersonating rests with the impersonated.
 * But - the system will send alerts to admins/impersonated to disable impersonation with 1-click.
 * Note: audit information in logs.
 * @executor The impersonating individual.
 * @forIndividuals An array of individuals the executor can impersonate.
 * @forOrganizations An array of organizations the executor can impersonate.
 */
 type T_OnBehalfPublic = {
    executor: T_IndId,
    forIndividuals: T_IndId[],
    forOrganizations: T_OrgId[]
}

/**
 * Interface to interact with type structure T_OnBehalfPublic for the impersonator.
 * @see T_OnBehalfPublic
 */
 interface I_OnBehalfPublicImpersonator {

    /**
     * Returns the impersonation information for the executor.
     * @param executor Impersonator.
     * @return Impersonation information / data structure.
     */
    get(executor: T_IndId): T_OnBehalfPublic ;

}

/**
 * Interface to interact with type structure T_OnBehalfPublic for the impersonated.
 * @see T_OnBehalfPublic
 */
interface I_OnBehalfPublicImpersonated {

    /**
     * Adds an individual to impersonate to the executor.
     * @param executor Impersonator.
     * @param forIndividual Impersonated.
     * @return Updated data structure.
     */
    addIndividual(executor: T_IndId, forIndividual: T_IndId): T_OnBehalfPublic ;

    /**
     * Removes an an impersonated individual from the executor.
     * @param executor Impersonator.
     * @param forIndividual Impersonated.
     * @return Updated data structure.
     */
    removeIndividual(executor: T_IndId, forIndividual: T_IndId): T_OnBehalfPublic ;

    /**
     * Adds an organization to impersonate to the executor.
     * @param executor Impersonator.
     * @param forOrganization Impersonated.
     * @return Updated data structure.
     */
    addOrganization(executor: T_IndId, forOrganization: T_OrgId): T_OnBehalfPublic ;

    /**
     * Removes an an impersonated organization from the executor.
     * @param executor Impersonator.
     * @param forOrganization Impersonated.
     * @return Updated data structure.
     */
    removeOrganization(executor: T_IndId, forOrganization: T_OrgId): T_OnBehalfPublic ;

}

/**
 * Interface to interact with type structure T_OnBehalfPublic for the system.
 * The system alerts all impersonated with a report of all those who are impersonating.
 * @see T_OnBehalfPublic
 */
 interface I_OnBehalfPublicInformation {

    /**
     * Alerts all impersonated individuals and organizations (admins) with a report
     * of all those who are impersonating.
     * It remains with the recipients, the impersonated to take action on it.
     */
    alertAllImpersonated(): void ;

}

/**
 * Type for Date - representated as ISO string with timezone.
 */
type T_Date = string ;

/**
 * Type structure to assigns a role to a regulatory/staff individual.
 * Typically grants data modification and decision making access.
 * Note: audit information in logs.
 * @executor The individual the role is assigned.
 * @role The role being assigned
 * @enableDate The date this role will be activated, readonly, can be in the future.
 * @disableDate The date this role will be deactivated.
 */
type T_StaffAccessRole = {
    executor: T_IndId,
    role: T_RoleKey,
    enableDate: T_Date,
    disableDate: T_Date
}

/**
 * Interface to interact with type structure T_ClientRole for the role assigned.
 * @see T_StaffAccessRole
 */
 interface I_StaffAccessRoleAssigned {

    /**
     * Returns the current active roles for the individual (executor).
     * @param executor The staff individual.
     * @return The active roles of the executor.
     */
    roles(executor: T_ClientId): T_StaffAccessRole[] ;

}

/**
 * Interface to interact with type structure T_StaffAccessRole for the role assigner.
 * @see T_StaffAccessRole
 */
 interface I_StaffAccessRoleAssigner {

    /**
     * Returns the matching data structure from the data store.
     * @param executor The individual role is being assigned.
     * @param role The role being assigned.
     * @return undefined if not found, else the data structure.
     */
    get(executor: T_IndId, role: T_RoleKey): T_StaffAccessRole | undefined ;
    
    /**
     * Assigns a role to an individual (executor) - as a new record.
     * @param executor The individual role is being assigned.
     * @param role The role being assigned.
     * @param enableFrom The date to enable the role being assigned. 
     * @param disableOn The date to disable the role being assigned.
     * @return The data structure.
     */
    assign(executor: T_IndId, role: T_RoleKey, enableFrom: T_Date, disableOn: T_Date): T_StaffAccessRole;

    /**
     * Disables the individual's (executor's) role by adjusting @disableDate to yesterday.
     * @param executor The individual role is being assigned.
     * @param role The role being assigned.
     * @return The data structure.
     */
    disable(executor: T_IndId, role: T_RoleKey): T_StaffAccessRole ;

    /**
     * Extends the disable date for the individual (executor) role - into the future.
     * @param executor The individual role is being assigned.
     * @param role The role being assigned.
     * @param disableDate The new date to disable the role, minimum yesterday. 
     * @return The data structure.
     */
    extend(executor: T_ClientId, role: T_RoleKey, disableDate: T_Date): T_StaffAccessRole ;

}

/**
 * Interface to interact with type structure T_StaffAccessRole for the system.
 * The system alerts all admins with a report of all those who are been assigned what roles.
 * @see T_StaffAccessRole
 */
 interface I_StaffAccessRoleInformation {

    /**
     * Alerts all impersonated individuals and organizations (admins) with a report
     * of all those who are impersonating.
     * It remains with the recipients, the impersonated to take action on it.
     */
    alertAllAdmins(): void ;

}


/**
 * Type for email addresses.
 */
// type T_Email = string ;


type T_Profile = {
    id: string,
    name: string,
    email: T_Email,
    phone: T_Phone,
    location: {
        region: T_Region,
        island: T_Island
    }
}