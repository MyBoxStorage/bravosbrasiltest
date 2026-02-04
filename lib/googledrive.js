// Google Drive API integration
let google = null;

function initGoogle() {
  if (!google && typeof require !== 'undefined') {
    try {
      google = require('googleapis').google;
    } catch (error) {
      console.error('Erro ao carregar googleapis:', error);
    }
  }
  return google;
}


export async function uploadToGoogleDrive(base64Data, filename, userId) {
  try {
    const google = initGoogle();
    if (!google) {
      throw new Error('Google APIs não disponíveis');
    }
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_id: process.env.GOOGLE_DRIVE_CLIENT_ID,
        client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
      },
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });

    const drive = google.drive({ version: 'v3', auth });
    
    if (!drive) {
      throw new Error('Google Drive não configurado');
    }

    // Converter base64 para buffer
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Image, 'base64');

    // Criar pasta para o usuário se não existir
    const folderName = `BRAVOS_BRASIL_Estampas_${userId}`;
    let folderId = null;

    // Buscar pasta existente
    const folderResponse = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)'
    });

    if (folderResponse.data.files.length > 0) {
      folderId = folderResponse.data.files[0].id;
    } else {
      // Criar nova pasta
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
      };

      const folder = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id'
      });

      folderId = folder.data.id;
    }

    // Upload do arquivo
    const fileMetadata = {
      name: filename,
      parents: [folderId]
    };

    const media = {
      mimeType: 'image/png',
      body: imageBuffer
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink'
    });

    // Tornar arquivo público para download
    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    return file.data.webContentLink || file.data.webViewLink;
  } catch (error) {
    console.error('Erro ao fazer upload para Google Drive:', error);
    throw error;
  }
}
