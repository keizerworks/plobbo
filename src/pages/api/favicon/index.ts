import type { APIRoute } from "astro";
import { db } from '../../../db';
import { and, eq } from "drizzle-orm";
import { UserTable } from "@/db/schema/user";
import path from 'path';
import { mkdir } from "fs/promises";
import { OrganizationTable } from "@/db/schema/organization";
import { createWriteStream } from "fs";
import { uploadToS3 } from "@/utils/storage/storage";

export const POST: APIRoute = async({ request }) => { 
    try { 
    const formData = await request.formData();
    const organizationId = formData.get('organizationId')?.toString();
    const userId = formData.get('userId')?.toString();
    const file = formData.get('favicon') as File;
    
    if (!organizationId || !userId) {
      return new Response(JSON.stringify({ error: 'Organization ID and User ID are required' }), {
        status: 400
      });
    }

    if (!file) {
      return new Response(JSON.stringify({ error: 'No favicon file provided' }), {
        status: 400
      });
    }


    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'Invalid file type. Must be an image.' }), {
        status: 400
      });
    }

    const [user] = await db
      .select()
      .from(UserTable)
      .where(
        and(
          eq(UserTable.id, userId),
          eq(UserTable.organizationId, organizationId),
          eq(UserTable.role, 'admin')
        )
    );

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized. Only organization admins can upload favicons.' }), {
        status: 403
      });
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `organizations/${organizationId}/favicon-${Date.now()}.${fileExtension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const faviconUrl = await uploadToS3(buffer, fileName, file.type);

    const [organization] = await db
      .select()
      .from(OrganizationTable)
      .where(eq(OrganizationTable.id, organizationId));

    if (!organization) {
      return new Response(JSON.stringify({ error: 'Organization not found' }), {
        status: 404
      });
    }

    const newSettings = {
      ...organization.settings,
      logo: faviconUrl
    };

    await db
      .update(OrganizationTable)
      .set({
        settings: newSettings
      })
      .where(eq(OrganizationTable.id, organizationId));
    
      return new Response(JSON.stringify({
        success: true,
        logo: faviconUrl
      }), {
        status: 200
      });
    } catch(error) { 
        console.error('Error uploading favicon:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500
        });
    }
}