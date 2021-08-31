export default function buildFormData(form) {
    let formData = new FormData()
    for (let [k, v] of Object.entries(form)) {
        formData.append(k, v)
    }

    return formData
}