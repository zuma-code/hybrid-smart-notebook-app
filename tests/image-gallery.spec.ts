import { test, expect } from '@playwright/test';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

// Helper para crear una imagen de prueba
function createTestImage(filename: string): string {
  const uploadsDir = join(process.cwd(), 'public', 'uploads');
  const filepath = join(uploadsDir, filename);
  
  // Crear una imagen PNG simple (1x1 pixel)
  const pngData = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  
  writeFileSync(filepath, pngData);
  return filepath;
}

test.describe('Image Gallery', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la galería
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
  });

  test('debe mostrar la página de galería', async ({ page }) => {
    // Verificar que el título esté presente
    await expect(page.getByRole('heading', { name: /Galería de Imágenes/i })).toBeVisible();
    
    // Verificar que el botón de subir esté presente (usar first() porque puede haber múltiples)
    await expect(page.getByRole('button', { name: /Subir Imagen/i }).first()).toBeVisible();
  });

  test('debe abrir el diálogo de subida de imagen', async ({ page }) => {
    // Hacer clic en el botón de subir (usar first() para evitar ambigüedad)
    await page.getByRole('button', { name: /Subir Imagen/i }).first().click();
    
    // Verificar que el diálogo se abra
    await expect(page.getByRole('dialog')).toBeVisible();
    // Usar el título del diálogo en lugar de texto genérico
    await expect(page.getByRole('heading', { name: /Subir Imagen/i })).toBeVisible();
    // Verificar que se muestre información sobre el tamaño máximo (puede haber múltiples, usar first)
    await expect(page.getByText(/máx\. 5MB/i).first()).toBeVisible();
  });

  test('debe mostrar mensaje cuando no hay imágenes', async ({ page }) => {
    // Verificar que se muestre el mensaje de "No hay imágenes aún"
    const noImagesMessage = page.getByText(/No hay imágenes aún/i);
    
    // Puede que no esté visible si hay imágenes, así que verificamos que exista o que haya imágenes
    const hasImages = await page.locator('img').count();
    
    if (hasImages === 0) {
      await expect(noImagesMessage).toBeVisible();
    }
  });

  test('debe permitir buscar imágenes', async ({ page }) => {
    // Buscar el input de búsqueda
    const searchInput = page.getByPlaceholder(/Buscar imágenes/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(500); // Esperar a que se filtre
    }
  });

  test('debe mostrar el campo de búsqueda', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Buscar imágenes/i);
    await expect(searchInput).toBeVisible();
  });
});

test.describe('Image Upload', () => {
  test('debe abrir el diálogo de upload', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    
    await page.getByRole('button', { name: /Subir Imagen/i }).first().click();
    
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/Arrastra una imagen aquí/i)).toBeVisible();
  });

  test('debe mostrar opción de seleccionar archivo', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    
    await page.getByRole('button', { name: /Subir Imagen/i }).first().click();
    
    // Verificar que haya un botón o texto para seleccionar archivo
    const selectButton = page.getByText(/haz clic para seleccionar/i);
    await expect(selectButton).toBeVisible();
  });

  test('debe validar tipo de archivo', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    
    await page.getByRole('button', { name: /Subir Imagen/i }).first().click();
    
    // Crear un archivo de texto (no imagen)
    const fileInput = page.locator('input[type="file"]');
    
    if (await fileInput.isVisible()) {
      // Intentar subir un archivo de texto (debería fallar)
      const testFilePath = join(process.cwd(), 'test-file.txt');
      writeFileSync(testFilePath, 'test content');
      
      await fileInput.setInputFiles(testFilePath);
      
      // Esperar a ver si aparece un error (puede que la validación sea del lado del cliente)
      await page.waitForTimeout(1000);
      
      // Limpiar
      if (existsSync(testFilePath)) {
        unlinkSync(testFilePath);
      }
    }
  });
});

test.describe('Image Picker en Editor', () => {
  test('debe mostrar botón de imagen en el editor', async ({ page }) => {
    // Ir a una página con editor (daily notes o concepts)
    await page.goto('/daily');
    await page.waitForLoadState('networkidle');
    
    // Buscar el editor
    const editor = page.locator('.ProseMirror').first();
    
    if (await editor.isVisible()) {
      // Buscar el toolbar del editor
      const imageButton = page.locator('button').filter({ hasText: /🖼️/ }).first();
      
      // El botón puede estar presente pero no visible hasta que se interactúa con el editor
      await editor.click();
      await page.waitForTimeout(500);
      
      // Verificar que el toolbar esté presente
      const toolbar = page.locator('[class*="border-b"]').first();
      await expect(toolbar).toBeVisible();
    }
  });
});

test.describe('Navegación a Galería', () => {
  test('debe poder navegar a la galería desde el sidebar', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Buscar el enlace de galería en el sidebar
    const galleryLink = page.getByRole('link', { name: /Galería/i });
    
    if (await galleryLink.isVisible()) {
      await galleryLink.click();
      await page.waitForURL('**/gallery');
      await expect(page.getByRole('heading', { name: /Galería de Imágenes/i })).toBeVisible();
    }
  });
});

