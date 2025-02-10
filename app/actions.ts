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

export async function deleteImage(id: number) {
  try {
    // First, get the image URL
    const { data: imageData, error: fetchError } = await supabaseAdmin
      .from("images")
      .select("url")
      .eq("id", id)
      .single()

    if (fetchError) {
      throw fetchError
    }

    if (!imageData) {
      throw new Error("Image not found")
    }

    // Extract the file name from the URL
    const fileName = imageData.url.split("/").pop()

    // Delete the image from storage
    const { error: storageError } = await supabaseAdmin.storage.from("images").remove([fileName])

    if (storageError) {
      throw storageError
    }

    // Delete the image record from the database
    const { error: deleteError } = await supabaseAdmin.from("images").delete().eq("id", id)

    if (deleteError) {
      throw deleteError
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteImage:", error)
    return { success: false, error: "Failed to delete image" }
  }
}

