"use server"

import { supabaseAdmin } from "../lib/supabase-client"

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File
    if (!file) {
      throw new Error("No file provided")
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    // Convert file to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabaseAdmin.storage.from("images").upload(filePath, buffer, {
      contentType: file.type,
    })

    if (uploadError) {
      throw uploadError
    }

    const { data: urlData } = supabaseAdmin.storage.from("images").getPublicUrl(filePath)

    const { error: insertError } = await supabaseAdmin.from("images").insert({ url: urlData.publicUrl })

    if (insertError) {
      throw insertError
    }

    return { success: true, url: urlData.publicUrl }
  } catch (error) {
    console.error("Error in uploadImage:", error)
    return { success: false, error: "Failed to upload image" }
  }
}

