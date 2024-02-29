export function blockHasErrors(errors: any = {}) {
    return Object.keys(errors).length > 0
}
