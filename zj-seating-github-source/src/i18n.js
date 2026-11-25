import dictionary from './zj-seating-i18n.json';
const STORAGE_KEY = 'zj-site-language-v1';
const supported = ['en', 'zh', 'es', 'de'];
const nativeNames = { en: 'English', zh: '简体中文', es: 'Español', de: 'Deutsch' };
const htmlLanguages = { en: 'en', zh: 'zh-CN', es: 'es', de: 'de' };

const ui = {
  en: {
    'chat.contactRnd': 'Contact the R&D team',
    'chat.rndNotes': 'I have a specific product idea or custom request:',
    'chat.quoteGaming': 'Ask about gaming chairs',
    'chat.gamingNotes': 'Interested in the updated gaming chair range. Please send the current designs and options.',
    'chat.viewModel': 'View {model}',
    'chat.addToRfq': 'Add {model} to RFQ',
    'chat.quoteModel': 'Request {model}',
    'chat.startRfq': 'Start an RFQ',
    'chat.show': 'Show {category}',
    'chat.documents': 'Request documents',
    'chat.typing': 'Ask ZJ is typing',
    'lead.successTitle': 'Inquiry sent',
    'lead.successReference': 'Reference: {reference}',
    'lead.successBody': 'Thank you. Our sales team will reply to {email}. Keep the reference number for any follow-up.',
    'lead.backHome': 'Back to homepage',
    'lead.close': 'Close',
    'lead.sent': 'Inquiry {reference} sent. Our sales team will reply by email.',
    'lead.checkFailed': 'Please complete the security check above the button, then send again.',
    'lead.sendFailed': 'Your inquiry could not be sent. Please try again or email sales@b2bsourcing.org.',
    'language.label': 'Select language',
    'lead.sandboxSaved': 'Sandbox RFQ {reference} saved. Two test emails were generated locally; nothing was sent externally.',
    'lead.sandboxSavedPO': 'Sandbox RFQ {reference} and PO template saved in this browser. Two test emails were generated; nothing was sent externally.',
    'lead.sandboxSavedPOError': 'Sandbox RFQ {reference} saved, but the PO template could not be stored. Nothing was sent externally.',
    'lead.invalidPOFile': 'Choose a PDF, Word, Excel, CSV, or TXT file up to 10 MB.',
    'rfq.list': 'RFQ list',
    'rfq.title': 'Your RFQ list',
    'rfq.count': '{count} models',
    'rfq.empty': 'Your RFQ list is empty. Add models from the catalog or product pages to build one consolidated inquiry.',
    'rfq.browse': 'Browse products',
    'rfq.add': 'Add to RFQ',
    'rfq.added': 'In RFQ list',
    'rfq.view': 'Review RFQ list',
    'rfq.quantity': 'Quantity',
    'rfq.quantityPlaceholder': 'Units',
    'rfq.notes': 'Model notes',
    'rfq.notesPlaceholder': 'Materials, colors, logo, or packaging',
    'rfq.remove': 'Remove',
    'rfq.clear': 'Clear list',
    'rfq.continue': 'Continue to inquiry',
    'rfq.general': 'General inquiry',
    'rfq.note': 'One project, multiple products. Quantities and requirements can be different for every model. This list is saved only in this browser.',
    'rfq.addedStatus': '{model} added to your RFQ list.',
    'rfq.existingStatus': '{model} is already in your RFQ list.',
    'rfq.removedStatus': '{model} removed from your RFQ list.',
    'rfq.clearedStatus': 'RFQ list cleared.',
    'rfq.storageError': 'The list is available for this visit, but browser storage is unavailable.',
    'rfq.summary': 'Shortlist models',
    'rfq.line': '{model} — Quantity: {quantity}; Notes: {notes}',
    'rfq.notSpecified': 'Not specified',
    'rfq.none': 'None',
    'rfq.close': 'Close RFQ list'
  },
  zh: {
    'chat.contactRnd': '联系研发团队',
    'chat.rndNotes': '我有具体的产品想法或定制需求：',
    'chat.quoteGaming': '咨询电竞椅',
    'chat.gamingNotes': '希望了解更新后的电竞椅系列，请发送最新款式和可选配置。',
    'chat.viewModel': '查看 {model}',
    'chat.addToRfq': '将 {model} 加入询价单',
    'chat.quoteModel': '询价 {model}',
    'chat.startRfq': '开始询价',
    'chat.show': '查看{category}',
    'chat.documents': '索取文件',
    'chat.typing': 'Ask ZJ 正在输入',
    'lead.successTitle': '询价已发送',
    'lead.successReference': '参考编号：{reference}',
    'lead.successBody': '谢谢。销售团队将回复至 {email}。后续沟通请保留此参考编号。',
    'lead.backHome': '返回首页',
    'lead.close': '关闭',
    'lead.sent': '询价 {reference} 已发送。销售团队将通过邮件回复您。',
    'lead.checkFailed': '请先完成按钮上方的安全验证，然后重新发送。',
    'lead.sendFailed': '询价未能发送。请重试，或发送邮件至 sales@b2bsourcing.org。',
    'language.label': '选择语言',
    'lead.sandboxSaved': '沙盒询价 {reference} 已保存。已在本地生成两封测试邮件，未向外部发送任何内容。',
    'lead.sandboxSavedPO': '沙盒询价 {reference} 和采购订单模板已保存在此浏览器中。已生成两封测试邮件，未向外部发送任何内容。',
    'lead.sandboxSavedPOError': '沙盒询价 {reference} 已保存，但采购订单模板无法存储。未向外部发送任何内容。',
    'lead.invalidPOFile': '请选择不超过 10 MB 的 PDF、Word、Excel、CSV 或 TXT 文件。',
    'rfq.list': '询价清单',
    'rfq.title': '您的询价清单',
    'rfq.count': '{count} 款产品',
    'rfq.empty': '您的询价清单为空。请从产品目录或详情页添加产品，一次提交多产品询价。',
    'rfq.browse': '浏览产品',
    'rfq.add': '加入询价',
    'rfq.added': '已加入询价',
    'rfq.view': '查看询价清单',
    'rfq.quantity': '数量',
    'rfq.quantityPlaceholder': '件数',
    'rfq.notes': '产品备注',
    'rfq.notesPlaceholder': '材料、颜色、标志或包装',
    'rfq.remove': '移除',
    'rfq.clear': '清空清单',
    'rfq.continue': '继续填写询价',
    'rfq.general': '通用询价',
    'rfq.note': '一个项目，多款产品。每款产品可填写不同数量和要求。清单仅保存在此浏览器中。',
    'rfq.addedStatus': '{model} 已加入询价清单。',
    'rfq.existingStatus': '{model} 已在询价清单中。',
    'rfq.removedStatus': '{model} 已从询价清单移除。',
    'rfq.clearedStatus': '询价清单已清空。',
    'rfq.storageError': '清单可在本次访问中使用，但浏览器存储不可用。',
    'rfq.summary': '询价产品',
    'rfq.line': '{model}——数量：{quantity}；备注：{notes}',
    'rfq.notSpecified': '未填写',
    'rfq.none': '无',
    'rfq.close': '关闭询价清单'
  },
  es: {
    'chat.contactRnd': 'Contactar al equipo de I+D',
    'chat.rndNotes': 'Tengo una idea de producto o una solicitud personalizada:',
    'chat.quoteGaming': 'Consultar sillas gaming',
    'chat.gamingNotes': 'Me interesa la gama actualizada de sillas gaming. Envíenme los diseños y opciones actuales.',
    'chat.viewModel': 'Ver {model}',
    'chat.addToRfq': 'Añadir {model} a la RFQ',
    'chat.quoteModel': 'Solicitar {model}',
    'chat.startRfq': 'Iniciar una RFQ',
    'chat.show': 'Ver {category}',
    'chat.documents': 'Solicitar documentos',
    'chat.typing': 'Ask ZJ está escribiendo',
    'lead.successTitle': 'Consulta enviada',
    'lead.successReference': 'Referencia: {reference}',
    'lead.successBody': 'Gracias. Nuestro equipo de ventas responderá a {email}. Conserve el número de referencia para cualquier seguimiento.',
    'lead.backHome': 'Volver al inicio',
    'lead.close': 'Cerrar',
    'lead.sent': 'Consulta {reference} enviada. Nuestro equipo de ventas le responderá por correo.',
    'lead.checkFailed': 'Complete la verificación de seguridad sobre el botón y vuelva a enviar.',
    'lead.sendFailed': 'No se pudo enviar su consulta. Inténtelo de nuevo o escriba a sales@b2bsourcing.org.',
    'language.label': 'Seleccionar idioma',
    'lead.sandboxSaved': 'La RFQ de prueba {reference} se guardó. Se generaron localmente dos correos de prueba; no se envió nada externamente.',
    'lead.sandboxSavedPO': 'La RFQ {reference} y la plantilla de orden de compra se guardaron en este navegador. Se generaron dos correos de prueba; no se envió nada externamente.',
    'lead.sandboxSavedPOError': 'La RFQ {reference} se guardó, pero no se pudo almacenar la plantilla de orden de compra. No se envió nada externamente.',
    'lead.invalidPOFile': 'Elija un archivo PDF, Word, Excel, CSV o TXT de hasta 10 MB.',
    'rfq.list': 'Lista RFQ',
    'rfq.title': 'Su lista de cotización',
    'rfq.count': '{count} modelos',
    'rfq.empty': 'Su lista está vacía. Añada modelos del catálogo o de las páginas de producto para preparar una sola consulta.',
    'rfq.browse': 'Ver productos',
    'rfq.add': 'Añadir a RFQ',
    'rfq.added': 'En la lista RFQ',
    'rfq.view': 'Revisar lista RFQ',
    'rfq.quantity': 'Cantidad',
    'rfq.quantityPlaceholder': 'Unidades',
    'rfq.notes': 'Notas del modelo',
    'rfq.notesPlaceholder': 'Materiales, colores, logotipo o embalaje',
    'rfq.remove': 'Eliminar',
    'rfq.clear': 'Vaciar lista',
    'rfq.continue': 'Continuar la consulta',
    'rfq.general': 'Consulta general',
    'rfq.note': 'Un proyecto, varios productos. Cada modelo puede tener su propia cantidad y requisitos. La lista solo se guarda en este navegador.',
    'rfq.addedStatus': '{model} se añadió a su lista de cotización.',
    'rfq.existingStatus': '{model} ya está en su lista de cotización.',
    'rfq.removedStatus': '{model} se eliminó de su lista de cotización.',
    'rfq.clearedStatus': 'Lista de cotización vaciada.',
    'rfq.storageError': 'La lista está disponible durante esta visita, pero el almacenamiento del navegador no está disponible.',
    'rfq.summary': 'Modelos seleccionados',
    'rfq.line': '{model} — Cantidad: {quantity}; Notas: {notes}',
    'rfq.notSpecified': 'Sin especificar',
    'rfq.none': 'Ninguna',
    'rfq.close': 'Cerrar lista de cotización'
  },
  de: {
    'chat.contactRnd': 'F&E-Team kontaktieren',
    'chat.rndNotes': 'Ich habe eine konkrete Produktidee oder Sonderanfrage:',
    'chat.quoteGaming': 'Gaming-Stühle anfragen',
    'chat.gamingNotes': 'Interesse an der aktualisierten Gaming-Stuhl-Reihe. Bitte senden Sie aktuelle Designs und Optionen.',
    'chat.viewModel': '{model} ansehen',
    'chat.addToRfq': '{model} zur Anfrage',
    'chat.quoteModel': '{model} anfragen',
    'chat.startRfq': 'Anfrage starten',
    'chat.show': '{category} anzeigen',
    'chat.documents': 'Dokumente anfordern',
    'chat.typing': 'Ask ZJ schreibt',
    'lead.successTitle': 'Anfrage gesendet',
    'lead.successReference': 'Referenz: {reference}',
    'lead.successBody': 'Vielen Dank. Unser Vertrieb antwortet an {email}. Bitte bewahren Sie die Referenznummer für Rückfragen auf.',
    'lead.backHome': 'Zur Startseite',
    'lead.close': 'Schließen',
    'lead.sent': 'Anfrage {reference} gesendet. Unser Vertrieb antwortet Ihnen per E-Mail.',
    'lead.checkFailed': 'Bitte schließen Sie die Sicherheitsprüfung über der Schaltfläche ab und senden Sie erneut.',
    'lead.sendFailed': 'Ihre Anfrage konnte nicht gesendet werden. Bitte erneut versuchen oder an sales@b2bsourcing.org schreiben.',
    'language.label': 'Sprache auswählen',
    'lead.sandboxSaved': 'Sandbox-RFQ {reference} wurde gespeichert. Zwei Test-E-Mails wurden lokal erstellt; nichts wurde extern versendet.',
    'lead.sandboxSavedPO': 'Sandbox-RFQ {reference} und Bestellvorlage wurden in diesem Browser gespeichert. Zwei Test-E-Mails wurden erstellt; nichts wurde extern versendet.',
    'lead.sandboxSavedPOError': 'Sandbox-RFQ {reference} wurde gespeichert, die Bestellvorlage konnte jedoch nicht gespeichert werden. Nichts wurde extern versendet.',
    'lead.invalidPOFile': 'Wählen Sie eine PDF-, Word-, Excel-, CSV- oder TXT-Datei mit maximal 10 MB.',
    'rfq.list': 'RFQ-Liste',
    'rfq.title': 'Ihre Angebotsliste',
    'rfq.count': '{count} Modelle',
    'rfq.empty': 'Ihre Liste ist leer. Fügen Sie Modelle aus dem Katalog oder von Produktseiten hinzu, um eine gemeinsame Anfrage zu stellen.',
    'rfq.browse': 'Produkte ansehen',
    'rfq.add': 'Zur RFQ hinzufügen',
    'rfq.added': 'In der RFQ-Liste',
    'rfq.view': 'RFQ-Liste prüfen',
    'rfq.quantity': 'Menge',
    'rfq.quantityPlaceholder': 'Einheiten',
    'rfq.notes': 'Modellnotizen',
    'rfq.notesPlaceholder': 'Materialien, Farben, Logo oder Verpackung',
    'rfq.remove': 'Entfernen',
    'rfq.clear': 'Liste leeren',
    'rfq.continue': 'Weiter zur Anfrage',
    'rfq.general': 'Allgemeine Anfrage',
    'rfq.note': 'Ein Projekt, mehrere Produkte. Jedes Modell kann eine eigene Menge und Anforderungen haben. Die Liste wird nur in diesem Browser gespeichert.',
    'rfq.addedStatus': '{model} wurde zur Angebotsliste hinzugefügt.',
    'rfq.existingStatus': '{model} ist bereits in Ihrer Angebotsliste.',
    'rfq.removedStatus': '{model} wurde aus der Angebotsliste entfernt.',
    'rfq.clearedStatus': 'Angebotsliste geleert.',
    'rfq.storageError': 'Die Liste ist für diesen Besuch verfügbar, der Browserspeicher ist jedoch nicht verfügbar.',
    'rfq.summary': 'Ausgewählte Modelle',
    'rfq.line': '{model} — Menge: {quantity}; Notizen: {notes}',
    'rfq.notSpecified': 'Nicht angegeben',
    'rfq.none': 'Keine',
    'rfq.close': 'Angebotsliste schließen'
  }
};

// Static and catalog copy. Text nodes retain their English source so switching back is lossless.
export const messages = {
  'Language': { zh: '语言', es: 'Idioma', de: 'Sprache' },
  'Select language': { zh: '选择语言', es: 'Seleccionar idioma', de: 'Sprache auswählen' },
  'Company': { zh: '公司', es: 'Empresa', de: 'Unternehmen' },
  'PO template (optional)': { zh: '采购订单模板（可选）', es: 'Plantilla de orden de compra (opcional)', de: 'Bestellvorlage (optional)' },
  'PDF, Word, Excel, CSV, or TXT · up to 10 MB · sent with your inquiry.': { zh: 'PDF、Word、Excel、CSV 或 TXT，最大 10 MB，将随询价一并发送。', es: 'PDF, Word, Excel, CSV o TXT · hasta 10 MB · se envía con su consulta.', de: 'PDF, Word, Excel, CSV oder TXT · maximal 10 MB · wird mit Ihrer Anfrage gesendet.' },
  'Products': { zh: '产品', es: 'Productos', de: 'Produkte' },
  'Quality': { zh: '品质', es: 'Calidad', de: 'Qualität' },
  'Factory': { zh: '工厂', es: 'Fábrica', de: 'Werk' },
  'Culture': { zh: '企业文化', es: 'Cultura', de: 'Unternehmenskultur' },
  'Request a quote': { zh: '获取报价', es: 'Solicitar cotización', de: 'Angebot anfordern' },
  'Open navigation': { zh: '打开导航', es: 'Abrir navegación', de: 'Navigation öffnen' },
  'Close navigation': { zh: '关闭导航', es: 'Cerrar navegación', de: 'Navigation schließen' },
  'ZJ Seating home': { zh: 'ZJ Seating 首页', es: 'Inicio de ZJ Seating', de: 'ZJ Seating Startseite' },
  'Primary navigation': { zh: '主导航', es: 'Navegación principal', de: 'Hauptnavigation' },
  'Skip to content': { zh: '跳至内容', es: 'Saltar al contenido', de: 'Zum Inhalt springen' },
  'Skip to product details': { zh: '跳至产品详情', es: 'Saltar a los detalles del producto', de: 'Zu den Produktdetails springen' },
  'OEM / ODM seating · Anji, Zhejiang': { zh: 'OEM / ODM 座椅 · 浙江安吉', es: 'Asientos OEM / ODM · Anji, Zhejiang', de: 'OEM-/ODM-Sitzmöbel · Anji, Zhejiang' },
  'Your next seating collection,': { zh: '您的下一个座椅系列，', es: 'Su próxima colección de asientos,', de: 'Ihre nächste Sitzmöbelkollektion,' },
  'built here.': { zh: '从这里开始。', es: 'creada aquí.', de: 'hier gefertigt.' },
  'Office, gaming, and lifestyle seating for importers, retailers, and private-label buyers—from first sample to container production.': { zh: '为进口商、零售商和自有品牌买家提供办公、电竞和生活方式座椅——从首个样品到整柜生产。', es: 'Asientos de oficina, gaming y lifestyle para importadores, minoristas y marcas privadas, desde la primera muestra hasta la producción de contenedores.', de: 'Büro-, Gaming- und Lifestyle-Sitzmöbel für Importeure, Händler und Private Labels – vom ersten Muster bis zur Containerproduktion.' },
  'Armrest': { zh: '扶手', es: 'Reposabrazos', de: 'Armlehne' },
  '4D adjustable': { zh: '4D 可调节', es: 'Ajuste 4D', de: '4D verstellbar' },
  'Finish': { zh: '表面处理', es: 'Acabado', de: 'Ausführung' },
  'Customizable': { zh: '可定制', es: 'Personalizable', de: 'Anpassbar' },
  'Loading': { zh: '装柜量', es: 'Carga', de: 'Beladung' },
  'Custom materials & colors': { zh: '定制材料与颜色', es: 'Materiales y colores personalizados', de: 'Individuelle Materialien und Farben' },
  'Sample support': { zh: '样品支持', es: 'Asistencia con muestras', de: 'Musterunterstützung' },
  'Export logistics': { zh: '出口物流', es: 'Logística de exportación', de: 'Exportlogistik' },
  'A five-star approach to partnership.': { zh: '五星合作伙伴体验。', es: 'Una colaboración de cinco estrellas.', de: 'Partnerschaft mit Fünf-Sterne-Anspruch.' },
  'Responsive answers. Clear specifications. Visible production steps. Practical export support. A better buying experience at every handoff.': { zh: '及时回复、清晰规格、透明生产步骤和实用出口支持，让每个采购衔接环节更顺畅。', es: 'Respuestas ágiles. Especificaciones claras. Producción visible. Apoyo práctico de exportación. Una mejor experiencia de compra en cada etapa.', de: 'Schnelle Antworten. Klare Spezifikationen. Transparente Produktion. Praktische Exportunterstützung. Ein besseres Einkaufserlebnis bei jeder Übergabe.' },
  'A focused range.': { zh: '精选产品系列。', es: 'Una gama selecta.', de: 'Eine fokussierte Auswahl.' },
  'Ready to customize.': { zh: '随时为您定制。', es: 'Lista para personalizar.', de: 'Bereit zur Anpassung.' },
  'Start with a proven frame, then tailor materials, colors, and packaging to your market.': { zh: '从成熟框架开始，根据您的市场定制材料、颜色和包装。', es: 'Comience con una estructura probada y adapte materiales, colores y embalaje a su mercado.', de: 'Beginnen Sie mit einem bewährten Gestell und passen Sie Materialien, Farben und Verpackung an Ihren Markt an.' },
  'All seating': { zh: '全部座椅', es: 'Todos los asientos', de: 'Alle Sitzmöbel' },
  'Mesh': { zh: '网椅', es: 'Malla', de: 'Netz' },
  'Executive': { zh: '主管椅', es: 'Ejecutivos', de: 'Chefsessel' },
  'Visitor': { zh: '访客椅', es: 'Visitantes', de: 'Besucher' },
  'Study': { zh: '学习椅', es: 'Estudio', de: 'Lernen' },
  'Task': { zh: '职员椅', es: 'Trabajo', de: 'Arbeitsstühle' },
  'Compressed sofas': { zh: '压缩沙发', es: 'Sofás comprimidos', de: 'Komprimierte Sofas' },
  'Quick view': { zh: '快速查看', es: 'Vista rápida', de: 'Schnellansicht' },
  'Compare': { zh: '对比', es: 'Comparar', de: 'Vergleichen' },
  'Added to compare': { zh: '已加入对比', es: 'Añadido para comparar', de: 'Zum Vergleich hinzugefügt' },
  'Product page': { zh: '产品页面', es: 'Página del producto', de: 'Produktseite' },
  'Preview design': { zh: '预览设计', es: 'Ver diseño', de: 'Design ansehen' },
  'Request specifications': { zh: '索取规格', es: 'Solicitar especificaciones', de: 'Spezifikationen anfordern' },
  'PUBLIC CATALOG': { zh: '公开目录', es: 'CATÁLOGO PÚBLICO', de: 'ÖFFENTLICHER KATALOG' },
  'FLAGSHIP PREVIEW': { zh: '旗舰预览', es: 'VISTA PREVIA INSIGNIA', de: 'FLAGGSCHIFF-VORSCHAU' },
  'DEALER DETAILS': { zh: '经销商资料', es: 'DETALLES PARA DISTRIBUIDORES', de: 'HÄNDLERDETAILS' },
  'A limited preview of our next premium executive direction.': { zh: '下一代高端主管椅设计方向的限量预览。', es: 'Una vista previa limitada de nuestra próxima línea ejecutiva premium.', de: 'Eine begrenzte Vorschau auf unsere nächste Premium-Chefsesselrichtung.' },
  'PRODUCT SHORTLIST': { zh: '产品候选清单', es: 'SELECCIÓN DE PRODUCTOS', de: 'PRODUKTAUSWAHL' },
  'Compare before you quote.': { zh: '先对比，再询价。', es: 'Compare antes de cotizar.', de: 'Vergleichen vor der Anfrage.' },
  'Compare now': { zh: '立即对比', es: 'Comparar ahora', de: 'Jetzt vergleichen' },
  'Request shortlist quote': { zh: '候选产品询价', es: 'Cotizar selección', de: 'Angebot für Auswahl' },
  'Clear': { zh: '清空', es: 'Vaciar', de: 'Leeren' },
  'Select up to three models to compare.': { zh: '最多选择三款产品进行对比。', es: 'Seleccione hasta tres modelos para comparar.', de: 'Wählen Sie bis zu drei Modelle zum Vergleichen.' },
  'SIDE-BY-SIDE REVIEW': { zh: '并排比较', es: 'COMPARACIÓN LADO A LADO', de: 'VERGLEICH IM ÜBERBLICK' },
  'Compare selected seating.': { zh: '对比所选座椅。', es: 'Compare los asientos seleccionados.', de: 'Ausgewählte Sitzmöbel vergleichen.' },
  'Product': { zh: '产品', es: 'Producto', de: 'Produkt' },
  'Category': { zh: '类别', es: 'Categoría', de: 'Kategorie' },
  'Disclosure level': { zh: '信息公开级别', es: 'Nivel de información', de: 'Informationsstufe' },
  'Dimensions': { zh: '尺寸', es: 'Dimensiones', de: 'Abmessungen' },
  'Minimum order (MOQ)': { zh: '最小起订量（MOQ）', es: 'Pedido mínimo (MOQ)', de: 'Mindestbestellmenge (MOQ)' },
  'Minimum order': { zh: '最小起订量', es: 'Pedido mínimo', de: 'Mindestbestellmenge' },
  'Container loading': { zh: '集装箱装载量', es: 'Carga del contenedor', de: 'Containerbeladung' },
  'Available through sales': { zh: '请联系销售获取', es: 'Disponible a través de ventas', de: 'Über den Vertrieb erhältlich' },
  'Remove': { zh: '移除', es: 'Eliminar', de: 'Entfernen' },
  'Keep browsing': { zh: '继续浏览', es: 'Seguir explorando', de: 'Weiter stöbern' },
  'Public specifications are shown for initial sourcing review. Dealer and flagship details remain available through sales. Your shortlist is saved only in this browser.': { zh: '公开规格供初步采购评估。经销商和旗舰产品详情请联系销售获取。候选清单仅保存在此浏览器中。', es: 'Las especificaciones públicas sirven para la evaluación inicial. Los detalles para distribuidores y modelos insignia están disponibles a través de ventas. La selección solo se guarda en este navegador.', de: 'Öffentliche Spezifikationen dienen der ersten Beschaffungsprüfung. Händler- und Flaggschiffdetails erhalten Sie über den Vertrieb. Ihre Auswahl wird nur in diesem Browser gespeichert.' },
  'THE RIGHT DETAIL AT THE RIGHT STAGE': { zh: '在合适阶段提供合适信息', es: 'LA INFORMACIÓN ADECUADA EN CADA ETAPA', de: 'DIE RICHTIGEN DETAILS ZUR RICHTIGEN ZEIT' },
  'Start with the design.': { zh: '从设计开始。', es: 'Comience con el diseño.', de: 'Beginnen Sie mit dem Design.' },
  'Go deeper with our team.': { zh: '与我们的团队深入了解。', es: 'Profundice con nuestro equipo.', de: 'Vertiefen Sie Details mit unserem Team.' },
  'Explore approved public details, then request the specifications and documents needed for your buyer and project review.': { zh: '查看已批准的公开信息，再索取买家和项目评估所需的规格与文件。', es: 'Consulte la información pública aprobada y solicite las especificaciones y documentos necesarios para evaluar su proyecto.', de: 'Prüfen Sie freigegebene Informationen und fordern Sie anschließend die Spezifikationen und Dokumente für Ihre Projektprüfung an.' },
  '01 · PUBLIC CATALOG': { zh: '01 · 公开目录', es: '01 · CATÁLOGO PÚBLICO', de: '01 · ÖFFENTLICHER KATALOG' },
  'Established models': { zh: '成熟型号', es: 'Modelos establecidos', de: 'Etablierte Modelle' },
  'Approved photography, published dimensions, MOQ, loading guidance, and sourcing options for initial comparison.': { zh: '提供获批图片、公开尺寸、最小起订量、装柜指导和采购选项，便于初步比较。', es: 'Fotografía aprobada, dimensiones publicadas, MOQ, orientación de carga y opciones de compra para una primera comparación.', de: 'Freigegebene Fotos, veröffentlichte Abmessungen, MOQ, Beladungshinweise und Beschaffungsoptionen für den ersten Vergleich.' },
  '02 · FLAGSHIP PREVIEW': { zh: '02 · 旗舰预览', es: '02 · VISTA PREVIA INSIGNIA', de: '02 · FLAGGSCHIFF-VORSCHAU' },
  '9628H · Limited first look': { zh: '9628H · 限量首次预览', es: '9628H · Primera vista limitada', de: '9628H · Begrenzte erste Vorschau' },
  'A design-direction teaser without engineering details, component specifications, loading data, or downloadable documents.': { zh: '仅展示设计方向，不提供工程细节、部件规格、装柜数据或可下载文件。', es: 'Una presentación del diseño sin detalles de ingeniería, especificaciones de componentes, datos de carga ni documentos descargables.', de: 'Eine Designvorschau ohne technische Details, Komponentendaten, Beladungsdaten oder Downloads.' },
  'View flagship preview': { zh: '查看旗舰预览', es: 'Ver vista previa insignia', de: 'Flaggschiff-Vorschau ansehen' },
  '03 · DEALER REVIEW': { zh: '03 · 经销商审核', es: '03 · EVALUACIÓN DE DISTRIBUIDOR', de: '03 · HÄNDLERPRÜFUNG' },
  'Detailed specifications': { zh: '详细规格', es: 'Especificaciones detalladas', de: 'Detaillierte Spezifikationen' },
  'Request model-specific details through sales so the right information can be aligned with your market, project, and sourcing needs.': { zh: '请通过销售索取型号详情，以便根据您的市场、项目和采购需求提供相应信息。', es: 'Solicite detalles del modelo a ventas para recibir la información adecuada a su mercado, proyecto y necesidades de compra.', de: 'Fordern Sie modellspezifische Details über den Vertrieb an, passend zu Markt, Projekt und Beschaffungsbedarf.' },
  'From idea to container, one clear process.': { zh: '从创意到整柜，流程清晰。', es: 'De la idea al contenedor, un proceso claro.', de: 'Von der Idee bis zum Container: ein klarer Prozess.' },
  'Bring a reference, a specification, or a new product brief. The concept keeps the journey visible at every step.': { zh: '您可以提供参考产品、规格或新产品需求，整个合作过程每一步都清晰可见。', es: 'Aporte una referencia, una especificación o un nuevo brief. El proceso es visible en cada etapa.', de: 'Bringen Sie eine Referenz, Spezifikation oder neue Produktanforderung mit. Jeder Schritt bleibt transparent.' },
  'Discuss your project': { zh: '讨论您的项目', es: 'Hablemos de su proyecto', de: 'Projekt besprechen' },
  'Define': { zh: '定义', es: 'Definir', de: 'Definieren' },
  'Model, materials, target market, quantity, and packaging.': { zh: '型号、材料、目标市场、数量和包装。', es: 'Modelo, materiales, mercado objetivo, cantidad y embalaje.', de: 'Modell, Materialien, Zielmarkt, Menge und Verpackung.' },
  'Sample': { zh: '打样', es: 'Muestra', de: 'Muster' },
  'Confirm the finish, details, and product specification.': { zh: '确认表面效果、细节和产品规格。', es: 'Confirme el acabado, los detalles y las especificaciones.', de: 'Ausführung, Details und Produktspezifikation bestätigen.' },
  'Produce': { zh: '生产', es: 'Producir', de: 'Produzieren' },
  'Move into production with agreed quality checkpoints.': { zh: '按照约定的质量检查点进入生产。', es: 'Inicie la producción con controles de calidad acordados.', de: 'Produktion mit vereinbarten Qualitätskontrollen starten.' },
  'Deliver': { zh: '交付', es: 'Entregar', de: 'Liefern' },
  'Coordinate inspection, export packing, and shipment.': { zh: '协调验货、出口包装和运输。', es: 'Coordine inspección, embalaje de exportación y envío.', de: 'Inspektion, Exportverpackung und Versand koordinieren.' },
  'PROFESSIONAL SEATING MANUFACTURER': { zh: '专业座椅制造商', es: 'FABRICANTE PROFESIONAL DE ASIENTOS', de: 'PROFESSIONELLER SITZMÖBELHERSTELLER' },
  'Built around healthy seating. Structured for global supply.': { zh: '专注健康座椅，服务全球供应。', es: 'Asientos saludables. Estructura para el suministro global.', de: 'Gesundes Sitzen. Strukturiert für globale Lieferung.' },
  'Established in 2009, ZJ Seating integrates research and development, production, and sales. Its Anji manufacturing operation supports seating programs across more than 60 countries and regions.': { zh: 'ZJ Seating 成立于 2009 年，集研发、生产和销售于一体。安吉制造基地为 60 多个国家和地区的座椅项目提供支持。', es: 'Fundada en 2009, ZJ Seating integra I+D, producción y ventas. Su planta de Anji respalda programas de asientos en más de 60 países y regiones.', de: 'ZJ Seating wurde 2009 gegründet und vereint Entwicklung, Produktion und Vertrieb. Das Werk in Anji unterstützt Sitzmöbelprogramme in über 60 Ländern und Regionen.' },
  'Discuss your sourcing brief': { zh: '讨论采购需求', es: 'Hablemos de su compra', de: 'Beschaffungsbedarf besprechen' },
  'ZJ Seating manufacturing facility · Anji, Zhejiang': { zh: 'ZJ Seating 制造基地 · 浙江安吉', es: 'Planta de ZJ Seating · Anji, Zhejiang', de: 'ZJ Seating Produktionsstandort · Anji, Zhejiang' },
  'Established': { zh: '成立时间', es: 'Fundación', de: 'Gegründet' },
  'Production bases': { zh: '生产基地', es: 'Bases de producción', de: 'Produktionsstandorte' },
  'R&D departments': { zh: '研发部门', es: 'Departamentos de I+D', de: 'F&E-Abteilungen' },
  'Export markets': { zh: '出口市场', es: 'Mercados de exportación', de: 'Exportmärkte' },
  'See the capability behind the collection.': { zh: '了解产品系列背后的制造实力。', es: 'Conozca la capacidad detrás de la colección.', de: 'Entdecken Sie die Stärke hinter der Kollektion.' },
  'Product development, lean production, quality testing, and export packing brought into one sourcing conversation.': { zh: '产品开发、精益生产、质量测试和出口包装，一站式对接采购需求。', es: 'Desarrollo, producción eficiente, pruebas de calidad y embalaje de exportación en una sola conversación de compra.', de: 'Produktentwicklung, schlanke Produktion, Qualitätsprüfung und Exportverpackung in einem Beschaffungsgespräch.' },
  'Production & quality checkpoints': { zh: '生产与质量检查点', es: 'Controles de producción y calidad', de: 'Produktions- und Qualitätskontrollen' },
  'Organized workflows support consistent, repeatable orders.': { zh: '有序流程支持稳定、可重复的订单交付。', es: 'Los flujos organizados permiten pedidos uniformes y repetibles.', de: 'Organisierte Abläufe sichern konsistente, wiederholbare Aufträge.' },
  'Product & process development': { zh: '产品与工艺开发', es: 'Desarrollo de productos y procesos', de: 'Produkt- und Prozessentwicklung' },
  'R&D and production work together across seating categories.': { zh: '研发与生产跨座椅品类协同合作。', es: 'I+D y producción colaboran en todas las categorías.', de: 'F&E und Produktion arbeiten kategorienübergreifend zusammen.' },
  'Compression & export packing': { zh: '压缩与出口包装', es: 'Compresión y embalaje de exportación', de: 'Kompression und Exportverpackung' },
  'Packing processes designed around efficient container loading.': { zh: '包装工艺围绕高效装柜而设计。', es: 'Procesos de embalaje diseñados para una carga eficiente.', de: 'Verpackungsprozesse für effiziente Containerbeladung.' },
  'QUALITY & COMPLIANCE': { zh: '品质与合规', es: 'CALIDAD Y CUMPLIMIENTO', de: 'QUALITÄT UND COMPLIANCE' },
  'Quality you can review.': { zh: '品质可供审核。', es: 'Calidad que puede comprobar.', de: 'Qualität, die Sie prüfen können.' },
  'Standards you can specify.': { zh: '标准可供指定。', es: 'Normas que puede especificar.', de: 'Normen, die Sie vorgeben können.' },
  'Company and product materials reference management systems and seating test standards. Ask for the documents relevant to your model and destination market.': { zh: '公司与产品资料涵盖管理体系和座椅测试标准。请索取适用于您型号和目的市场的文件。', es: 'Los materiales de la empresa y los productos citan sistemas de gestión y normas de prueba. Solicite los documentos aplicables a su modelo y mercado.', de: 'Unternehmens- und Produktunterlagen verweisen auf Managementsysteme und Prüfnormen. Fordern Sie die Dokumente für Ihr Modell und Ihren Zielmarkt an.' },
  'Request quality documents': { zh: '索取质量文件', es: 'Solicitar documentos de calidad', de: 'Qualitätsdokumente anfordern' },
  'MANAGEMENT SYSTEM': { zh: '管理体系', es: 'SISTEMA DE GESTIÓN', de: 'MANAGEMENTSYSTEM' },
  'Quality management system documentation.': { zh: '质量管理体系文件。', es: 'Documentación del sistema de gestión de calidad.', de: 'Dokumentation des Qualitätsmanagementsystems.' },
  'Environmental management system documentation.': { zh: '环境管理体系文件。', es: 'Documentación del sistema de gestión ambiental.', de: 'Dokumentation des Umweltmanagementsystems.' },
  'SEATING TEST STANDARD': { zh: '座椅测试标准', es: 'NORMA DE PRUEBAS DE ASIENTOS', de: 'SITZMÖBEL-PRÜFNORM' },
  'General-purpose office chair testing.': { zh: '通用办公椅测试。', es: 'Pruebas de sillas de oficina de uso general.', de: 'Prüfung von Bürostühlen für allgemeine Zwecke.' },
  'Office work chair requirements.': { zh: '办公工作椅要求。', es: 'Requisitos para sillas de trabajo de oficina.', de: 'Anforderungen an Büroarbeitsstühle.' },
  'Certificate validity and test coverage can vary by entity, model, and market. Current certificates and model-specific reports are available through the sales team on request.': { zh: '证书有效性和测试范围可能因主体、型号和市场而异。可向销售团队索取现行证书和型号测试报告。', es: 'La validez y cobertura pueden variar según la entidad, el modelo y el mercado. Solicite certificados vigentes e informes específicos al equipo de ventas.', de: 'Zertifikatsgültigkeit und Prüfumfang variieren je nach Rechtsträger, Modell und Markt. Aktuelle Dokumente erhalten Sie auf Anfrage über den Vertrieb.' },
  'OUR WORKING CULTURE': { zh: '我们的企业文化', es: 'NUESTRA CULTURA DE TRABAJO', de: 'UNSERE ARBEITSKULTUR' },
  'Quality.': { zh: '品质。', es: 'Calidad.', de: 'Qualität.' },
  'Innovation.': { zh: '创新。', es: 'Innovación.', de: 'Innovation.' },
  'Cooperation.': { zh: '协作。', es: 'Cooperación.', de: 'Zusammenarbeit.' },
  'Better seating comes from shared standards: careful product thinking, open collaboration, and details that make daily use feel effortless.': { zh: '更好的座椅源于共同标准：用心思考产品、开放协作，以及让日常使用轻松自如的细节。', es: 'Los mejores asientos nacen de normas compartidas: diseño cuidadoso, colaboración abierta y detalles que facilitan el uso diario.', de: 'Bessere Sitzmöbel entstehen durch gemeinsame Standards: sorgfältiges Produktdenken, offene Zusammenarbeit und Details für mühelose Nutzung.' },
  'ZJ Seating’s product principles connect design and manufacturing with the practical needs of international buyers.': { zh: 'ZJ Seating 的产品理念将设计制造与国际买家的实际需求相结合。', es: 'Los principios de ZJ Seating conectan diseño y fabricación con las necesidades de compradores internacionales.', de: 'Die Produktprinzipien von ZJ Seating verbinden Design und Fertigung mit den Anforderungen internationaler Einkäufer.' },
  'Safe': { zh: '安全', es: 'Seguro', de: 'Sicher' },
  'Comfortable': { zh: '舒适', es: 'Cómodo', de: 'Komfortabel' },
  'Unique': { zh: '独特', es: 'Único', de: 'Einzigartig' },
  'Easy': { zh: '易用', es: 'Fácil', de: 'Einfach' },
  'Environmentally friendly': { zh: '环保', es: 'Ecológico', de: 'Umweltfreundlich' },
  'Elegant': { zh: '优雅', es: 'Elegante', de: 'Elegant' },
  'Economical': { zh: '经济', es: 'Económico', de: 'Wirtschaftlich' },
  'Efficient': { zh: '高效', es: 'Eficiente', de: 'Effizient' },
  'Let’s build your next best-seller.': { zh: '共同打造您的下一款畅销产品。', es: 'Creemos su próximo éxito de ventas.', de: 'Entwickeln wir Ihren nächsten Bestseller.' },
  'Office, gaming, and lifestyle seating for global B2B buyers.': { zh: '为全球 B2B 买家提供办公、电竞和生活方式座椅。', es: 'Asientos de oficina, gaming y lifestyle para compradores B2B internacionales.', de: 'Büro-, Gaming- und Lifestyle-Sitzmöbel für internationale B2B-Einkäufer.' },
  'Explore': { zh: '探索', es: 'Explorar', de: 'Entdecken' },
  'Contact': { zh: '联系方式', es: 'Contacto', de: 'Kontakt' },
  'Concept site by B2B Sourcing · Not the official ZJ Seating website': { zh: '由 B2B Sourcing 制作的概念网站 · 非 ZJ Seating 官方网站', es: 'Sitio conceptual de B2B Sourcing · No es el sitio oficial de ZJ Seating', de: 'Konzeptseite von B2B Sourcing · Nicht die offizielle ZJ-Seating-Website' },
  'Product landing page concept': { zh: '产品落地页设计概念', es: 'Concepto de página de producto', de: 'Produktseiten-Designkonzept' },
  'PROJECT INQUIRY': { zh: '项目询价', es: 'CONSULTA DE PROYECTO', de: 'PROJEKTANFRAGE' },
  'Tell us what you’re building.': { zh: '告诉我们您的产品计划。', es: 'Cuéntenos qué quiere desarrollar.', de: 'Beschreiben Sie Ihr Vorhaben.' },
  'A short brief is enough to start the conversation.': { zh: '简要需求即可开启沟通。', es: 'Un breve resumen es suficiente para comenzar.', de: 'Eine kurze Beschreibung genügt für den Anfang.' },
  'Request type': { zh: '请求类型', es: 'Tipo de solicitud', de: 'Anfrageart' },
  'Order a sample': { zh: '订购样品', es: 'Solicitar una muestra', de: 'Muster anfordern' },
  'Custom design / R&D request': { zh: '定制设计 / 研发需求', es: 'Diseño personalizado / solicitud a I+D', de: 'Individuelles Design / F&E-Anfrage' },
  'Request certificates / test reports': { zh: '索取证书 / 测试报告', es: 'Solicitar certificados / informes', de: 'Zertifikate / Prüfberichte anfordern' },
  'Product / model': { zh: '产品 / 型号', es: 'Producto / modelo', de: 'Produkt / Modell' },
  'Name': { zh: '姓名', es: 'Nombre', de: 'Name' },
  'Work email': { zh: '工作邮箱', es: 'Correo de trabajo', de: 'Geschäftliche E-Mail' },
  'Estimated quantity': { zh: '预计数量', es: 'Cantidad estimada', de: 'Voraussichtliche Menge' },
  'Destination': { zh: '目的地', es: 'Destino', de: 'Zielort' },
  'Project notes': { zh: '项目备注', es: 'Notas del proyecto', de: 'Projektnotizen' },
  'Units': { zh: '件数', es: 'Unidades', de: 'Einheiten' },
  'Country / port': { zh: '国家 / 港口', es: 'País / puerto', de: 'Land / Hafen' },
  'Materials, colors, target timing, or customization needs': { zh: '材料、颜色、目标时间或定制需求', es: 'Materiales, colores, plazos o personalización', de: 'Materialien, Farben, Zeitplan oder Anpassungen' },
  'Send inquiry': { zh: '发送询价', es: 'Enviar consulta', de: 'Anfrage senden' },
  'Concept preview only — your inquiry has not been sent. This form is ready to connect to the ZJ Seating sales workflow.': { zh: '仅为概念预览——您的询价尚未发送。此表单可接入 ZJ Seating 销售工作流程。', es: 'Solo vista previa: su consulta no se ha enviado. Este formulario está listo para conectarse al flujo de ventas de ZJ Seating.', de: 'Nur eine Konzeptvorschau – Ihre Anfrage wurde nicht gesendet. Das Formular kann an den Vertriebsworkflow von ZJ Seating angebunden werden.' },
  'Close quote form': { zh: '关闭询价表单', es: 'Cerrar formulario de cotización', de: 'Anfrageformular schließen' },
  'Close product details': { zh: '关闭产品详情', es: 'Cerrar detalles del producto', de: 'Produktdetails schließen' },
  'Close product comparison': { zh: '关闭产品对比', es: 'Cerrar comparación', de: 'Produktvergleich schließen' },
  'Full product page': { zh: '完整产品页面', es: 'Página completa del producto', de: 'Vollständige Produktseite' },
  'Request this model': { zh: '请求此型号报价', es: 'Solicitar este modelo', de: 'Dieses Modell anfragen' },
  'Register buyer interest': { zh: '登记买家意向', es: 'Registrar interés de compra', de: 'Käuferinteresse registrieren' },
  'Request dealer specifications': { zh: '索取经销商规格', es: 'Solicitar especificaciones para distribuidores', de: 'Händlerspezifikationen anfordern' },
  'Published specifications are suitable for initial sourcing review. Confirm current materials, colors, availability, and packaging with sales.': { zh: '公开规格适用于初步采购评估。请与销售确认当前材料、颜色、供货和包装。', es: 'Las especificaciones publicadas sirven para la compra inicial. Confirme materiales, colores, disponibilidad y embalaje con ventas.', de: 'Veröffentlichte Spezifikationen dienen der ersten Beschaffungsprüfung. Bestätigen Sie Materialien, Farben, Verfügbarkeit und Verpackung mit dem Vertrieb.' },
  'A limited first look. Dimensions, construction, component details, loading data, and specification sheets are reserved for a controlled sales review.': { zh: '限量首次预览。尺寸、结构、部件细节、装柜数据和规格表需通过受控销售审核获取。', es: 'Una primera vista limitada. Dimensiones, construcción, componentes, carga y fichas técnicas requieren una revisión controlada con ventas.', de: 'Eine begrenzte erste Vorschau. Abmessungen, Konstruktion, Komponenten, Beladungsdaten und Datenblätter sind einer kontrollierten Vertriebsprüfung vorbehalten.' },
  'Detailed dimensions, MOQ, loading data, and documents are shared after a buyer and project review. No protected document download is represented in this concept.': { zh: '详细尺寸、起订量、装柜数据和文件将在买家与项目审核后提供。本概念不提供受保护文件下载。', es: 'Las dimensiones, el MOQ, la carga y los documentos se comparten tras evaluar al comprador y el proyecto. Este concepto no incluye descargas protegidas.', de: 'Detaillierte Abmessungen, MOQ, Beladungsdaten und Dokumente werden nach Käufer- und Projektprüfung bereitgestellt. Geschützte Downloads sind in diesem Konzept nicht enthalten.' },
  'A first look at ZJ Seating’s next premium executive direction, with a refined high-back silhouette and a coordinated finish story. Detailed design and engineering information remains available through a controlled buyer review.': { zh: '抢先了解 ZJ Seating 下一代高端主管椅设计，精致高背轮廓搭配协调饰面。详细设计和工程信息需通过受控买家审核获取。', es: 'Una primera mirada a la próxima línea ejecutiva premium de ZJ Seating, con respaldo alto y acabados coordinados. La información técnica requiere una evaluación controlada del comprador.', de: 'Ein erster Blick auf die nächste Premium-Chefsesselrichtung von ZJ Seating mit hochlehniger Silhouette und abgestimmten Oberflächen. Technische Details erhalten Sie nach kontrollierter Käuferprüfung.' },
  'Model': { zh: '型号', es: 'Modelo', de: 'Modell' },
  'Controlled preview': { zh: '受控预览', es: 'Vista previa controlada', de: 'Kontrollierte Vorschau' },
  'Available through buyer review': { zh: '通过买家审核获取', es: 'Disponible tras evaluación del comprador', de: 'Nach Käuferprüfung verfügbar' },
  'Virtual assistant': { zh: '虚拟助手', es: 'Asistente virtual', de: 'Virtueller Assistent' },
  'VIRTUAL ASSISTANT': { zh: '虚拟助手', es: 'ASISTENTE VIRTUAL', de: 'VIRTUELLER ASSISTENT' },
  'Ask ZJ': { zh: '咨询 ZJ', es: 'Preguntar a ZJ', de: 'ZJ fragen' },
  'Find a chair': { zh: '寻找座椅', es: 'Buscar una silla', de: 'Stuhl finden' },
  'Explore sofas': { zh: '探索沙发', es: 'Explorar sofás', de: 'Sofas entdecken' },
  'Quality documents': { zh: '质量文件', es: 'Documentos de calidad', de: 'Qualitätsdokumente' },
  'Ask about a model, MOQ, or lead time…': { zh: '询问型号、起订量或交期…', es: 'Pregunte por modelo, MOQ o plazo…', de: 'Fragen Sie nach Modell, MOQ oder Lieferzeit…' },
  'AI assistant · Answers from the ZJ catalog · Sales confirms specs and prices': { zh: 'AI 助手 · 依据 ZJ 产品目录回答 · 规格与价格以销售确认为准', es: 'Asistente de IA · Responde con el catálogo de ZJ · Ventas confirma especificaciones y precios', de: 'KI-Assistent · Antworten aus dem ZJ-Katalog · Spezifikationen und Preise bestätigt der Vertrieb' },
  'Close virtual assistant': { zh: '关闭虚拟助手', es: 'Cerrar asistente virtual', de: 'Virtuellen Assistenten schließen' },
  'Send question': { zh: '发送问题', es: 'Enviar pregunta', de: 'Frage senden' },
  'Ask about products, orders, or the factory': { zh: '咨询产品、订单或工厂', es: 'Pregunte sobre productos, pedidos o fábrica', de: 'Fragen zu Produkten, Aufträgen oder Werk' },
  'Product catalog': { zh: '产品目录', es: 'Catálogo de productos', de: 'Produktkatalog' },
  'Breadcrumb': { zh: '面包屑导航', es: 'Ruta de navegación', de: 'Brotkrumennavigation' },
  'Sourcing options': { zh: '采购选项', es: 'Opciones de compra', de: 'Beschaffungsoptionen' },
  'Custom finishes': { zh: '定制饰面', es: 'Acabados personalizados', de: 'Individuelle Oberflächen' },
  'Export packing': { zh: '出口包装', es: 'Embalaje de exportación', de: 'Exportverpackung' },
  'Copy product link': { zh: '复制产品链接', es: 'Copiar enlace del producto', de: 'Produktlink kopieren' },
  'QR product link': { zh: '二维码产品链接', es: 'Enlace QR del producto', de: 'QR-Produktlink' },
  'SCAN TO OPEN': { zh: '扫码打开', es: 'ESCANEAR PARA ABRIR', de: 'ZUM ÖFFNEN SCANNEN' },
  'QR-ready product page': { zh: '支持二维码的产品页面', es: 'Página de producto con QR', de: 'Produktseite mit QR-Code' },
  'Scanning opens this exact model. Use the published HTTPS version for printed packaging, showroom labels, and sales materials. NFC can use the same destination as an optional alternative.': { zh: '扫码即可打开此型号。印刷包装、展厅标签和销售资料请使用已发布的 HTTPS 地址。NFC 可作为可选替代方式使用相同链接。', es: 'El código abre este modelo exacto. Use la versión HTTPS publicada para embalajes, etiquetas de sala de exposición y materiales de venta. NFC puede usar el mismo destino como alternativa.', de: 'Der Scan öffnet genau dieses Modell. Nutzen Sie die veröffentlichte HTTPS-URL für Verpackung, Showroom und Vertriebsmaterial. NFC kann optional dasselbe Ziel verwenden.' },
  'Download QR': { zh: '下载二维码', es: 'Descargar QR', de: 'QR-Code herunterladen' },
  'NFC optional': { zh: '可选 NFC', es: 'NFC opcional', de: 'NFC optional' },
  'SOURCING SUPPORT': { zh: '采购支持', es: 'ASISTENCIA DE COMPRA', de: 'BESCHAFFUNGSUNTERSTÜTZUNG' },
  'Make this model yours.': { zh: '定制您的专属型号。', es: 'Haga suyo este modelo.', de: 'Machen Sie dieses Modell zu Ihrem.' },
  'Align the product, packaging, and quality documents around your market before production.': { zh: '生产前根据您的市场确认产品、包装和质量文件。', es: 'Adapte producto, embalaje y documentos de calidad a su mercado antes de producir.', de: 'Stimmen Sie Produkt, Verpackung und Qualitätsdokumente vor der Produktion auf Ihren Markt ab.' },
  'Materials & colors': { zh: '材料与颜色', es: 'Materiales y colores', de: 'Materialien und Farben' },
  'Tailor the finish around your collection and target positioning.': { zh: '围绕您的系列和目标定位定制饰面。', es: 'Adapte el acabado a su colección y posicionamiento.', de: 'Passen Sie die Ausführung an Kollektion und Positionierung an.' },
  'Sampling & confirmation': { zh: '打样与确认', es: 'Muestras y confirmación', de: 'Muster und Bestätigung' },
  'Review the agreed product details before volume production.': { zh: '批量生产前确认约定的产品细节。', es: 'Revise los detalles acordados antes de la producción.', de: 'Prüfen Sie die vereinbarten Details vor der Serienproduktion.' },
  'Documents & logistics': { zh: '文件与物流', es: 'Documentos y logística', de: 'Dokumente und Logistik' },
  'Request model-specific reports, packing data, and export support.': { zh: '索取型号报告、包装数据和出口支持。', es: 'Solicite informes del modelo, datos de embalaje y apoyo de exportación.', de: 'Fordern Sie Modellberichte, Verpackungsdaten und Exportunterstützung an.' },
  'Continue exploring.': { zh: '继续探索。', es: 'Siga explorando.', de: 'Entdecken Sie mehr.' },
  'View all 24 products': { zh: '查看全部 24 款产品', es: 'Ver los 24 productos', de: 'Alle 24 Produkte ansehen' },
  'View product': { zh: '查看产品', es: 'Ver producto', de: 'Produkt ansehen' },
  'PRODUCT INQUIRY': { zh: '产品询价', es: 'CONSULTA DE PRODUCTO', de: 'PRODUKTANFRAGE' },
  'Discuss this model.': { zh: '讨论此型号。', es: 'Hablemos de este modelo.', de: 'Dieses Modell besprechen.' },
  'The product model is already included in your brief.': { zh: '产品型号已包含在您的需求中。', es: 'El modelo ya está incluido en su consulta.', de: 'Das Produktmodell ist bereits in Ihrer Anfrage enthalten.' }
};

// Public catalog labels and descriptions.
Object.assign(messages, {
  'Executive mesh': { zh: '主管网椅', es: 'Malla ejecutiva', de: 'Executive-Netz' },
  'Mesh collection': { zh: '网椅系列', es: 'Colección de malla', de: 'Netz-Kollektion' },
  'Ergonomic mesh': { zh: '人体工学家网椅', es: 'Malla ergonómica', de: 'Ergonomisches Netz' },
  'Premium mesh': { zh: '高端网椅', es: 'Malla premium', de: 'Premium-Netz' },
  'High-back mesh': { zh: '高背网椅', es: 'Malla de respaldo alto', de: 'Netz mit hoher Lehne' },
  'Premium executive': { zh: '高端主管椅', es: 'Ejecutivo premium', de: 'Premium-Chefsessel' },
  'Color collection': { zh: '多彩系列', es: 'Colección de color', de: 'Farbkollektion' },
  'Visitor seating': { zh: '访客座椅', es: 'Asientos de visita', de: 'Besuchersitzmöbel' },
  'Study collection': { zh: '学习椅系列', es: 'Colección de estudio', de: 'Lernstuhl-Kollektion' },
  'Everyday task': { zh: '日常职员椅', es: 'Trabajo diario', de: 'Alltags-Arbeitsstuhl' },
  'Compressed sofa': { zh: '压缩沙发', es: 'Sofá comprimido', de: 'Komprimiertes Sofa' },
  'Compressed sectional': { zh: '压缩组合沙发', es: 'Seccional comprimido', de: 'Komprimiertes Ecksofa' },
  'Modular sofa': { zh: '模块沙发', es: 'Sofá modular', de: 'Modulares Sofa' },
  'Lounge seating': { zh: '休闲座椅', es: 'Asientos lounge', de: 'Lounge-Sitzmöbel' },
  'Convertible seating': { zh: '可转换座椅', es: 'Asiento convertible', de: 'Wandelbares Sitzmöbel' },
  'High-back support with a sharp, contemporary profile.': { zh: '高背支撑，轮廓利落现代。', es: 'Respaldo alto con un perfil contemporáneo.', de: 'Hohe Rückenlehne mit klarer, moderner Silhouette.' },
  'A light visual footprint for modern office ranges.': { zh: '轻盈外观，适合现代办公系列。', es: 'Una presencia ligera para oficinas modernas.', de: 'Leichte Optik für moderne Büroserien.' },
  'Everyday ergonomics with retail-ready appeal.': { zh: '日常人体工学设计，兼具零售吸引力。', es: 'Ergonomía diaria con atractivo comercial.', de: 'Alltagsergonomie mit attraktiver Handelswirkung.' },
  'Adjustable comfort in an easy-to-specify finish.': { zh: '可调节舒适体验，饰面便于选购。', es: 'Comodidad ajustable en un acabado fácil de especificar.', de: 'Verstellbarer Komfort in einfach spezifizierbarer Ausführung.' },
  'A substantial high-back profile for executive ranges.': { zh: '宽厚高背造型，适合主管椅系列。', es: 'Un respaldo alto y sólido para gamas ejecutivas.', de: 'Markante hohe Lehne für Chefsesselserien.' },
  'Padded comfort with a restrained executive aesthetic.': { zh: '软包舒适体验，主管椅风格内敛。', es: 'Comodidad acolchada con estética ejecutiva sobria.', de: 'Gepolsterter Komfort mit zurückhaltender Chefsesseloptik.' },
  'Adjustable support with a three-position locking mechanism.': { zh: '可调节支撑，三档锁定机构。', es: 'Soporte ajustable con bloqueo de tres posiciones.', de: 'Verstellbare Unterstützung mit dreistufiger Arretierung.' },
  'A light grey frame with 3D arms and adjustable support.': { zh: '浅灰框架，配备 3D 扶手和可调节支撑。', es: 'Estructura gris claro con brazos 3D y soporte ajustable.', de: 'Hellgraues Gestell mit 3D-Armlehnen und verstellbarer Unterstützung.' },
  'A tall mesh back with adjustable headrest and lumbar support.': { zh: '高背网面，头枕与腰托均可调节。', es: 'Respaldo alto de malla con cabecero y soporte lumbar ajustables.', de: 'Hohe Netzlehne mit verstellbarer Kopfstütze und Lordosenstütze.' },
  'A refined premium executive silhouette.': { zh: '精致的高端主管椅轮廓。', es: 'Una silueta ejecutiva premium refinada.', de: 'Elegante Premium-Chefsessel-Silhouette.' },
  'Adjustable headrest and lumbar support with 3D arms.': { zh: '可调节头枕与腰托，配备 3D 扶手。', es: 'Cabecero y soporte lumbar ajustables con brazos 3D.', de: 'Verstellbare Kopf- und Lordosenstütze mit 3D-Armlehnen.' },
  'A compact high-back profile in a statement red finish.': { zh: '紧凑高背造型，红色饰面醒目。', es: 'Perfil compacto de respaldo alto en rojo llamativo.', de: 'Kompakte hohe Lehne in markanter roter Ausführung.' },
  'A clean, light finish for coordinated office collections.': { zh: '简洁浅色饰面，适合协调办公系列。', es: 'Acabado claro y limpio para colecciones coordinadas.', de: 'Klare, helle Ausführung für abgestimmte Bürokollektionen.' },
  'Coordinated guest seating with a fixed cantilever frame.': { zh: '配套访客座椅，固定弓形框架。', es: 'Asientos de visita coordinados con estructura cantilever fija.', de: 'Abgestimmte Besucherstühle mit festem Freischwinger.' },
  'A compact study chair with a supportive integrated footrest.': { zh: '紧凑学习椅，配有一体式支撑脚踏。', es: 'Silla de estudio compacta con reposapiés integrado.', de: 'Kompakter Lernstuhl mit integrierter Fußstütze.' },
  'A playful color option with a practical integrated footrest.': { zh: '活泼配色，配有实用一体式脚踏。', es: 'Color alegre con práctico reposapiés integrado.', de: 'Freundliche Farboption mit praktischer Fußstütze.' },
  'Space-conscious study seating with foldable nylon arms.': { zh: '节省空间的学习椅，尼龙扶手可折叠。', es: 'Silla de estudio compacta con brazos de nailon plegables.', de: 'Platzsparender Lernstuhl mit klappbaren Nylonarmlehnen.' },
  'An accessible task-chair option with folding 2D arms.': { zh: '经济实用的职员椅，配备折叠 2D 扶手。', es: 'Silla de trabajo accesible con brazos 2D plegables.', de: 'Zugänglicher Arbeitsstuhl mit klappbaren 2D-Armlehnen.' },
  'A tailored three-seat silhouette in breathable upholstery.': { zh: '精致三人座轮廓，搭配透气面料。', es: 'Silueta de tres plazas con tapizado transpirable.', de: 'Elegante Dreisitzer-Silhouette mit atmungsaktivem Bezug.' },
  'A generous sectional with a warm, residential character.': zhEsDe('宽敞组合沙发，营造温暖居家氛围。','Un seccional generoso con cálido carácter residencial.','Großzügiges Ecksofa mit warmem Wohncharakter.'),
  'A sculptural curved profile with a deep lounge seat.': zhEsDe('雕塑感弧形轮廓，配深座休闲体验。','Perfil curvo escultural con asiento lounge profundo.','Skulpturale geschwungene Form mit tiefer Lounge-Sitzfläche.'),
  'A flexible modular layout with a relaxed low profile.': zhEsDe('灵活模块布局，低矮造型轻松休闲。','Diseño modular flexible con perfil bajo y relajado.','Flexibles modulares Layout mit entspannter niedriger Form.'),
  'A soft one-seat lounge design for compact living ranges.': zhEsDe('柔和单人休闲设计，适合紧凑家居系列。','Diseño lounge individual suave para espacios compactos.','Weicher Ein-Sitzer für kompakte Wohnserien.'),
  'A compact lounge chair with a convertible folded format.': zhEsDe('紧凑休闲椅，可转换折叠形态。','Sillón compacto con formato plegado convertible.','Kompakter Loungesessel mit wandelbarer Faltform.')
});

function zhEsDe(zh, es, de) { return { zh, es, de }; }

let language = 'en';
let initialized = false;
const listeners = new Set();
const textSources = new WeakMap();
const attributeSources = new WeakMap();

function normalizeLanguage(value) {
  const lower = String(value || '').toLowerCase();
  if (lower.startsWith('zh')) return 'zh';
  if (lower.startsWith('es')) return 'es';
  if (lower.startsWith('de')) return 'de';
  return 'en';
}

export function getLanguage() { return language; }

export function t(key, replacements = {}) {
  const template = ui[language]?.[key] || ui.en[key] || key;
  return Object.entries(replacements).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), template);
}

export function translateText(text) {
  return messages[text]?.[language] || text;
}

function sourceFor(stored, current) {
  if (!stored) return current;
  const variants = [stored, ...Object.values(messages[stored] || {})];
  return variants.includes(current) ? stored : current;
}

export function translateTree(root = document) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    if (node.parentElement?.closest('script, style, .language-picker')) return;
    const match = node.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!match || !match[2]) return;
    const original = sourceFor(textSources.get(node), match[2]);
    textSources.set(node, original);
    node.nodeValue = `${match[1]}${language === 'en' ? original : translateText(original)}${match[3]}`;
  });

  const elements = root.nodeType === Node.ELEMENT_NODE ? [root, ...root.querySelectorAll('*')] : [...document.querySelectorAll('*')];
  elements.forEach((element) => {
    if (element.closest('.language-picker')) return;
    const records = attributeSources.get(element) || {};
    ['aria-label', 'placeholder', 'title', 'alt'].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const current = element.getAttribute(attribute);
      const original = sourceFor(records[attribute], current);
      records[attribute] = original;
      const value = language === 'en' ? original : translateText(original);
      element.setAttribute(attribute, value);
    });
    attributeSources.set(element, records);
  });
}

function injectLanguagePicker() {
  if (document.querySelector('.language-picker')) return;
  const topbar = document.querySelector('.topbar-inner');
  if (!topbar) return;
  const email = topbar.querySelector('a[href^="mailto:"]');
  const actions = document.createElement('div');
  actions.className = 'topbar-actions';
  if (email) actions.append(email);

  const label = document.createElement('label');
  label.className = 'language-picker';
  const accessible = document.createElement('span');
  accessible.className = 'sr-only';
  accessible.textContent = 'Language';
  const select = document.createElement('select');
  select.id = 'language-select';
  select.setAttribute('aria-label', t('language.label'));
  supported.forEach((code) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = nativeNames[code];
    select.append(option);
  });
  select.value = language;
  select.addEventListener('change', () => setLanguage(select.value));
  const globe = document.createElement('span');
  globe.className = 'language-globe';
  globe.setAttribute('aria-hidden', 'true');
  globe.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.4 3 14.6 0 18M12 3c-3 3.4-3 14.6 0 18"/></svg>';
  label.append(accessible, globe, select);
  actions.append(label);
  topbar.append(actions);
}

function applyLanguage() {
  document.documentElement.lang = htmlLanguages[language];
  const select = document.querySelector('#language-select');
  if (select) select.value = language;
  document.querySelectorAll('[data-set-lang]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.setLang === language)));
  translateTree(document);
  listeners.forEach((listener) => listener(language));
}

export function setLanguage(value, updateUrl = true) {
  language = normalizeLanguage(value);
  try { window.localStorage.setItem(STORAGE_KEY, language); } catch {}
  if (updateUrl) {
    const url = new URL(window.location.href);
    if (language === 'en') url.searchParams.delete('lang');
    else url.searchParams.set('lang', language);
    window.history.replaceState({}, '', url);
  }
  applyLanguage();
}


// B2 redesign: Gemini's dictionary (EN, ZH, ES, DE used; FR, PT, IT kept for later) plus new page copy.
function registerDictionary() {
  const at = (lang, path) => path.reduce((node, key) => node?.[key], dictionary[lang]);
  const walk = (node, path) => Object.entries(node).forEach(([key, value]) => {
    if (value && typeof value === 'object') return walk(value, [...path, key]);
    const entry = {};
    ['zh', 'es', 'de'].forEach((lang) => { const text = at(lang, [...path, key]); if (text) entry[lang] = text; });
    messages[value] = { ...(messages[value] || {}), ...entry };
  });
  walk(dictionary.en, []);
  ['en', 'zh', 'es', 'de'].forEach((lang) => {
    ui[lang]['rfq.add'] = dictionary[lang].card.addRfq;
    ui[lang]['rfq.added'] = dictionary[lang].card.inRfq;
  });
  Object.assign(ui.en, { 'rfq.addPrimary': 'Add to RFQ list', 'rfq.addedPrimary': '✓ In RFQ list' });
  Object.assign(ui.zh, { 'rfq.addPrimary': '加入询价单', 'rfq.addedPrimary': '✓ 已加入询价单' });
  Object.assign(ui.es, { 'rfq.addPrimary': 'Añadir a la lista de cotización', 'rfq.addedPrimary': '✓ En la lista de cotización' });
  Object.assign(ui.de, { 'rfq.addPrimary': 'Zur Anfrageliste hinzufügen', 'rfq.addedPrimary': '✓ In der Anfrageliste' });
}
registerDictionary();
Object.assign(messages, {
  'Ask a question': { zh: '在线咨询', es: 'Hacer una pregunta', de: 'Frage stellen' },
  'OEM / ODM seating manufacturer': { zh: 'OEM / ODM 座椅制造商', es: 'Fabricante de asientos OEM / ODM', de: 'OEM / ODM-Sitzmöbelhersteller' },
  'Contract seating, made in Anji, Zhejiang.': { zh: '商用座椅，产自浙江安吉。', es: 'Asientos para contract, fabricados en Anji, Zhejiang.', de: 'Objektsitzmöbel, gefertigt in Anji, Zhejiang.' },
  'Office chairs, gaming chairs and compressed sofas for importers, retail chains, contract dealers and private-label brands. From first sample to full container.': { zh: '为进口商、零售连锁、工程经销商及自有品牌提供办公椅、电竞椅与压缩沙发。从首件打样到整柜出货。', es: 'Sillas de oficina, sillas gaming y sofás comprimidos para importadores, cadenas minoristas, distribuidores contract y marcas propias. De la primera muestra al contenedor completo.', de: 'Bürostühle, Gaming-Stühle und Kompressionssofas für Importeure, Handelsketten, Objekthändler und Eigenmarken. Vom ersten Muster bis zum vollen Container.' },
  'View the catalog →': { zh: '查看产品目录 →', es: 'Ver el catálogo →', de: 'Zum Katalog →' },
  'Start an RFQ →': { zh: '开始询价 →', es: 'Iniciar una cotización →', de: 'Anfrage starten →' },
  'Production base · Anji, Zhejiang · Est. 2009': { zh: '生产基地 · 浙江安吉 · 始于 2009', es: 'Planta de producción · Anji, Zhejiang · Desde 2009', de: 'Produktionswerk · Anji, Zhejiang · Seit 2009' },
  'Seating R&D, production and sales': { zh: '座椅研发、生产与销售', es: 'I+D, producción y venta de asientos', de: 'Entwicklung, Produktion und Vertrieb' },
  'Chairs and compressed sofas': { zh: '座椅与压缩沙发', es: 'Sillas y sofás comprimidos', de: 'Stühle und Kompressionssofas' },
  'New models and custom briefs': { zh: '新品开发与定制需求', es: 'Nuevos modelos y proyectos a medida', de: 'Neue Modelle und Sonderanfertigungen' },
  'Export packing and container loading': { zh: '出口包装与装柜', es: 'Embalaje de exportación y carga de contenedores', de: 'Exportverpackung und Containerverladung' },
  'Specifications from current product sheets. Dealer models are shared after a buyer review.': { zh: '规格参数来自现行产品资料。大客户专供型号在买家审核后提供。', es: 'Especificaciones según las fichas de producto vigentes. Los modelos para distribuidores se comparten tras revisar al comprador.', de: 'Daten aus den aktuellen Produktblättern. Händlermodelle werden nach einer Käuferprüfung freigegeben.' },
  'Start from a catalog frame, a reference sample or a new brief. Materials, colors, packaging and branding are set around your market.': { zh: '可基于现有型号、参考样品或全新需求启动项目。材质、颜色、包装与品牌均按您的市场定制。', es: 'Parta de un modelo del catálogo, una muestra de referencia o un nuevo brief. Materiales, colores, embalaje y marca se ajustan a su mercado.', de: 'Starten Sie mit einem Katalogmodell, einem Referenzmuster oder einem neuen Briefing. Materialien, Farben, Verpackung und Branding richten sich nach Ihrem Markt.' },
  'Discuss a project →': { zh: '洽谈项目 →', es: 'Hablar de un proyecto →', de: 'Projekt besprechen →' },
  'Send a brief to R&D →': { zh: '向研发团队提交需求 →', es: 'Enviar un brief a I+D →', de: 'Briefing an F&E senden →' },
  'Seating R&D, production and sales in one company since 2009, with three production bases and exports to more than 60 countries and regions.': { zh: '自 2009 年起集座椅研发、生产与销售于一体，拥有三大生产基地，出口 60 多个国家和地区。', es: 'I+D, producción y venta de asientos en una sola empresa desde 2009, con tres plantas de producción y exportaciones a más de 60 países y regiones.', de: 'Entwicklung, Produktion und Vertrieb von Sitzmöbeln in einem Unternehmen seit 2009, mit drei Produktionswerken und Export in über 60 Länder und Regionen.' },
  'Production and quality checkpoints': { zh: '生产与质检节点', es: 'Producción y controles de calidad', de: 'Produktion und Qualitätsprüfpunkte' },
  'Foam and upholstery production': { zh: '海绵与软包生产', es: 'Producción de espuma y tapicería', de: 'Schaum- und Polsterfertigung' },
  'Compression and export packing': { zh: '压缩与出口包装', es: 'Compresión y embalaje de exportación', de: 'Kompression und Exportverpackung' },
  'Certificates and test reports are sent per model and destination market.': { zh: '证书与测试报告按型号及目标市场提供。', es: 'Los certificados e informes de ensayo se envían por modelo y mercado de destino.', de: 'Zertifikate und Prüfberichte erhalten Sie je Modell und Zielmarkt.' },
  'Write to the team that owns your question. Replies come by email.': { zh: '请直接联系负责相关事项的团队，我们将通过邮件回复。', es: 'Escriba al equipo responsable de su consulta. Respondemos por correo.', de: 'Schreiben Sie direkt an das zuständige Team. Die Antwort kommt per E-Mail.' },
  'Quotes, samples, orders and lead times': { zh: '报价、样品、订单与交期', es: 'Cotizaciones, muestras, pedidos y plazos', de: 'Angebote, Muster, Aufträge und Lieferzeiten' },
  'Custom designs, materials and new product briefs': { zh: '定制设计、材质与新品需求', es: 'Diseños a medida, materiales y nuevos productos', de: 'Sonderdesigns, Materialien und neue Produktideen' },
  'Certificates, test reports and inspections': { zh: '证书、测试报告与验货', es: 'Certificados, informes de ensayo e inspecciones', de: 'Zertifikate, Prüfberichte und Inspektionen' },
  'Send an inquiry →': { zh: '发送询价 →', es: 'Enviar consulta →', de: 'Anfrage senden →' },
  'Send a brief →': { zh: '提交需求 →', es: 'Enviar brief →', de: 'Briefing senden →' },
  'Request documents →': { zh: '索取文件 →', es: 'Solicitar documentos →', de: 'Dokumente anfordern →' },
  'Concept by B2B Sourcing': { zh: '概念网站 · B2B Sourcing 制作', es: 'Concepto de B2B Sourcing', de: 'Konzept von B2B Sourcing' },
  'Color shown': { zh: '图示颜色', es: 'Color mostrado', de: 'Abgebildete Farbe' },
  'Other colors': { zh: '其他颜色', es: 'Otros colores', de: 'Weitere Farben' },
  'In a room setting': { zh: '场景图', es: 'En un ambiente', de: 'Im Raum' },
  'Mesh, frame and upholstery colors on request': { zh: '网布、框架及软包颜色可按需定制', es: 'Colores de malla, estructura y tapizado bajo pedido', de: 'Netz-, Gestell- und Polsterfarben auf Anfrage' },
  'Upholstery colors on request': { zh: '软包颜色可按需定制', es: 'Colores de tapizado bajo pedido', de: 'Polsterfarben auf Anfrage' },
  'Fabrics and colors on request': { zh: '面料与颜色可按需定制', es: 'Tejidos y colores bajo pedido', de: 'Stoffe und Farben auf Anfrage' },
  'Also in grey. Other colors on request.': { zh: '另有灰色款，其他颜色可按需定制。', es: 'También en gris. Otros colores bajo pedido.', de: 'Auch in Grau. Weitere Farben auf Anfrage.' },
  'Also in pink (8422M-PK). Other colors on request.': { zh: '另有粉色款（8422M-PK），其他颜色可按需定制。', es: 'También en rosa (8422M-PK). Otros colores bajo pedido.', de: 'Auch in Rosa (8422M-PK). Weitere Farben auf Anfrage.' },
  'Also in blue (8422MJ-BL). Other colors on request.': { zh: '另有蓝色款（8422MJ-BL），其他颜色可按需定制。', es: 'También en azul (8422MJ-BL). Otros colores bajo pedido.', de: 'Auch in Blau (8422MJ-BL). Weitere Farben auf Anfrage.' },
  'Also in black, as shown. Other colors on request.': { zh: '另有黑色款（见图），其他颜色可按需定制。', es: 'También en negro, como se muestra. Otros colores bajo pedido.', de: 'Auch in Schwarz, wie abgebildet. Weitere Farben auf Anfrage.' },
  'Red seat and headrest, black mesh and base': { zh: '红色坐垫与头枕，黑色网背与底座', es: 'Asiento y cabecero rojos, malla y base negras', de: 'Roter Sitz und Kopfstütze, schwarzes Netz und Fußkreuz' },
  'Blue seat and headrest, light grey mesh and frame': { zh: '蓝色坐垫与头枕，浅灰网背与框架', es: 'Asiento y cabecero azules, malla y estructura gris claro', de: 'Blauer Sitz und Kopfstütze, hellgraues Netz und Gestell' },
  'Pink mesh, white frame and base': { zh: '粉色网布，白色框架与底座', es: 'Malla rosa, estructura y base blancas', de: 'Rosa Netz, weißes Gestell und Fußkreuz' },
  'Grey mesh back, black seat and base': { zh: '灰色网背，黑色坐垫与底座', es: 'Respaldo de malla gris, asiento y base negros', de: 'Graue Netzrückenlehne, schwarzer Sitz und Fußkreuz' },
  'Brown PU leather, chrome base': { zh: '棕色PU皮，镀铬底座', es: 'Piel sintética marrón, base cromada', de: 'Braunes PU-Leder, verchromtes Fußkreuz' },
  'Black PU leather, chrome base': { zh: '黑色PU皮，镀铬底座', es: 'Piel sintética negra, base cromada', de: 'Schwarzes PU-Leder, verchromtes Fußkreuz' },
  'Black mesh, black frame and base': { zh: '黑色网布，黑色框架与底座', es: 'Malla negra, estructura y base negras', de: 'Schwarzes Netz, schwarzes Gestell und Fußkreuz' },
  'Black mesh, light grey frame and base': { zh: '黑色网布，浅灰框架与底座', es: 'Malla negra, estructura y base gris claro', de: 'Schwarzes Netz, hellgraues Gestell und Fußkreuz' },
  'Tan fabric, matte black metal arms': { zh: '驼色布艺，哑光黑色金属扶手', es: 'Tejido camel, brazos de metal negro mate', de: 'Hellbrauner Stoff, mattschwarze Metallarmlehnen' },
  'Sage green mesh, black base': { zh: '灰绿色网布，黑色底座', es: 'Malla verde salvia, base negra', de: 'Salbeigrünes Netz, schwarzes Fußkreuz' },
  'Black mesh, red frame, arms and base': { zh: '黑色网布，红色框架、扶手与底座', es: 'Malla negra, estructura, brazos y base rojos', de: 'Schwarzes Netz, rotes Gestell, Armlehnen und Fußkreuz' },
  'Cream mesh, light grey frame and base': { zh: '米白色网布，浅灰框架与底座', es: 'Malla crema, estructura y base gris claro', de: 'Cremefarbenes Netz, hellgraues Gestell und Fußkreuz' },
  'Black mesh, light grey frame': { zh: '黑色网布，浅灰框架', es: 'Malla negra, estructura gris claro', de: 'Schwarzes Netz, hellgraues Gestell' },
  'Light blue mesh and frame': { zh: '浅蓝色网布与框架', es: 'Malla y estructura azul claro', de: 'Hellblaues Netz und Gestell' },
  'Pink mesh and frame': { zh: '粉色网布与框架', es: 'Malla y estructura rosa', de: 'Rosa Netz und Gestell' },
  'White frame with black mesh': { zh: '白色框架配黑色网布', es: 'Estructura blanca con malla negra', de: 'Weißes Gestell mit schwarzem Netz' },
  'Black PU, black base': { zh: '黑色PU，黑色底座', es: 'Piel sintética negra, base negra', de: 'Schwarzes PU, schwarzes Fußkreuz' },
  'Sage green corduroy': { zh: '灰绿色灯芯绒', es: 'Pana verde salvia', de: 'Salbeigrüner Cord' },
  'Rust orange fabric': { zh: '铁锈橙色面料', es: 'Tejido naranja óxido', de: 'Rostorangefarbener Stoff' },
  'Dark grey corduroy': { zh: '深灰色灯芯绒', es: 'Pana gris oscuro', de: 'Dunkelgrauer Cord' },
  'Ochre corduroy': { zh: '赭黄色灯芯绒', es: 'Pana ocre', de: 'Ockerfarbener Cord' },
  'Cream textured fabric': { zh: '米白色肌理面料', es: 'Tejido texturizado crema', de: 'Cremefarbener Strukturstoff' },
  'Olive green corduroy': { zh: '橄榄绿灯芯绒', es: 'Pana verde oliva', de: 'Olivgrüner Cord' },
  'Specifications on request': { zh: '规格参数按需提供', es: 'Especificaciones bajo pedido', de: 'Daten auf Anfrage' },
  'Send': { zh: '发送', es: 'Enviar', de: 'Senden' },
});

export function initI18n() {
  if (initialized) return;
  initialized = true;
  const requested = new URLSearchParams(window.location.search).get('lang');
  let saved = '';
  try { saved = window.localStorage.getItem(STORAGE_KEY) || ''; } catch {}
  language = requested ? normalizeLanguage(requested) : saved ? normalizeLanguage(saved) : normalizeLanguage(navigator.language);
  injectLanguagePicker();
  document.querySelectorAll('[data-set-lang]').forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.setLang)));
  applyLanguage();
}

export function onLanguageChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}


Object.assign(ui.en, {
  'catalog.count': '{count} products',
  'comparison.count': '{count} of 3 selected',
  'comparison.addAria': 'Add {model} to comparison',
  'comparison.removeAria': 'Remove {model} from comparison',
  'comparison.fullTitle': 'Remove a model before adding another. The shortlist holds up to three.',
  'comparison.minTitle': 'Select at least two models to compare.',
  'comparison.full': 'Your shortlist is full. Remove a model before adding {model}.',
  'comparison.added': '{model} added. You can add {remaining} more.',
  'comparison.ready': '{model} added. Your three-model shortlist is ready to compare.',
  'comparison.removed': '{model} removed. Select up to three models to compare.',
  'comparison.removedShort': '{model} removed from your shortlist.',
  'comparison.cleared': 'Shortlist cleared. Select up to three models to compare.',
  'comparison.needTwo': 'Select at least two models to open a comparison.',
  'comparison.dialogStatus': '{count} models · Published details are shown where available; other specifications require sales review.',
  'comparison.quote': 'Request quote for {count} models',
  'comparison.storageError': 'Shortlist updated for this visit. Browser storage is unavailable, so it may not persist after reload.'
});
Object.assign(ui.zh, {
  'catalog.count': '{count} 款产品',
  'comparison.count': '已选 {count} / 3 款',
  'comparison.addAria': '将 {model} 加入对比',
  'comparison.removeAria': '将 {model} 移出对比',
  'comparison.fullTitle': '请先移除一款产品再添加。候选清单最多容纳三款。',
  'comparison.minTitle': '请至少选择两款产品进行对比。',
  'comparison.full': '候选清单已满。请先移除一款产品，再添加 {model}。',
  'comparison.added': '{model} 已添加，还可添加 {remaining} 款。',
  'comparison.ready': '{model} 已添加，三款产品已可对比。',
  'comparison.removed': '{model} 已移除。最多可选择三款产品对比。',
  'comparison.removedShort': '{model} 已从候选清单移除。',
  'comparison.cleared': '候选清单已清空。最多选择三款产品进行对比。',
  'comparison.needTwo': '请至少选择两款产品打开对比。',
  'comparison.dialogStatus': '{count} 款产品 · 显示已公开的详情，其他规格需联系销售审核。',
  'comparison.quote': '为 {count} 款产品请求报价',
  'comparison.storageError': '候选清单已在本次访问中更新，但浏览器存储不可用，刷新后可能无法保留。'
});
Object.assign(ui.es, {
  'catalog.count': '{count} productos',
  'comparison.count': '{count} de 3 seleccionados',
  'comparison.addAria': 'Añadir {model} a la comparación',
  'comparison.removeAria': 'Quitar {model} de la comparación',
  'comparison.fullTitle': 'Elimine un modelo antes de añadir otro. La selección admite hasta tres.',
  'comparison.minTitle': 'Seleccione al menos dos modelos para comparar.',
  'comparison.full': 'La selección está completa. Elimine un modelo antes de añadir {model}.',
  'comparison.added': '{model} añadido. Puede añadir {remaining} más.',
  'comparison.ready': '{model} añadido. Su selección de tres modelos está lista para comparar.',
  'comparison.removed': '{model} eliminado. Seleccione hasta tres modelos para comparar.',
  'comparison.removedShort': '{model} se eliminó de su selección.',
  'comparison.cleared': 'Selección vaciada. Seleccione hasta tres modelos para comparar.',
  'comparison.needTwo': 'Seleccione al menos dos modelos para abrir la comparación.',
  'comparison.dialogStatus': '{count} modelos · Se muestran los detalles publicados; otras especificaciones requieren revisión de ventas.',
  'comparison.quote': 'Solicitar cotización para {count} modelos',
  'comparison.storageError': 'La selección se actualizó para esta visita, pero el almacenamiento no está disponible y podría no conservarse.'
});
Object.assign(ui.de, {
  'catalog.count': '{count} Produkte',
  'comparison.count': '{count} von 3 ausgewählt',
  'comparison.addAria': '{model} zum Vergleich hinzufügen',
  'comparison.removeAria': '{model} aus dem Vergleich entfernen',
  'comparison.fullTitle': 'Entfernen Sie zuerst ein Modell. Die Auswahl umfasst bis zu drei Modelle.',
  'comparison.minTitle': 'Wählen Sie mindestens zwei Modelle zum Vergleichen.',
  'comparison.full': 'Ihre Auswahl ist voll. Entfernen Sie ein Modell, bevor Sie {model} hinzufügen.',
  'comparison.added': '{model} hinzugefügt. Sie können noch {remaining} hinzufügen.',
  'comparison.ready': '{model} hinzugefügt. Ihre drei Modelle sind bereit zum Vergleich.',
  'comparison.removed': '{model} entfernt. Wählen Sie bis zu drei Modelle zum Vergleichen.',
  'comparison.removedShort': '{model} wurde aus Ihrer Auswahl entfernt.',
  'comparison.cleared': 'Auswahl geleert. Wählen Sie bis zu drei Modelle zum Vergleichen.',
  'comparison.needTwo': 'Wählen Sie mindestens zwei Modelle, um den Vergleich zu öffnen.',
  'comparison.dialogStatus': '{count} Modelle · Veröffentlichte Details werden angezeigt; weitere Spezifikationen erhalten Sie über den Vertrieb.',
  'comparison.quote': 'Angebot für {count} Modelle anfordern',
  'comparison.storageError': 'Die Auswahl wurde für diesen Besuch aktualisiert, kann aber ohne Browserspeicher möglicherweise nicht gespeichert werden.'
});

Object.assign(messages, {
  'MULTI-MODEL INQUIRY': zhEsDe('多产品询价', 'CONSULTA DE VARIOS MODELOS', 'ANFRAGE FÜR MEHRERE MODELLE'),
  'Add to RFQ': zhEsDe('加入询价', 'Añadir a RFQ', 'Zur RFQ hinzufügen'),
  'In RFQ list': zhEsDe('已加入询价', 'En la lista RFQ', 'In der RFQ-Liste'),
  'PRODUCT QUICK VIEW': zhEsDe('产品快速查看', 'VISTA RÁPIDA DEL PRODUCTO', 'PRODUKT-SCHNELLANSICHT'),
  'ZJ assistant': zhEsDe('ZJ 助手', 'Asistente ZJ', 'ZJ-Assistent'),
  'Explore compressed sofas': zhEsDe('探索压缩沙发', 'Explorar sofás comprimidos', 'Komprimierte Sofas entdecken'),
  'Mesh chairs': zhEsDe('网椅', 'Sillas de malla', 'Netzstühle'),
  'Browse the catalog': zhEsDe('浏览目录', 'Explorar el catálogo', 'Katalog ansehen'),
  'Start an RFQ': zhEsDe('开始询价', 'Iniciar una RFQ', 'RFQ starten'),
  'Discuss timing': zhEsDe('讨论交期', 'Consultar plazos', 'Zeitplan besprechen'),
  'See the factory': zhEsDe('了解工厂', 'Ver la fábrica', 'Werk ansehen'),
  'Review quality section': zhEsDe('查看质量部分', 'Ver sección de calidad', 'Qualitätsbereich ansehen'),
  'Request documents': zhEsDe('索取文件', 'Solicitar documentos', 'Dokumente anfordern'),
  'View the process': zhEsDe('查看流程', 'Ver el proceso', 'Prozess ansehen'),
  'Discuss a project': zhEsDe('讨论项目', 'Hablar de un proyecto', 'Projekt besprechen'),
  'Prepare an RFQ': zhEsDe('准备询价', 'Preparar una RFQ', 'RFQ vorbereiten'),
  'Browse all products': zhEsDe('浏览全部产品', 'Ver todos los productos', 'Alle Produkte ansehen'),
  'Product URL copied. Use the published HTTPS URL for QR printing or optional NFC encoding.': zhEsDe('产品链接已复制。二维码印刷或可选 NFC 写入请使用已发布的 HTTPS 地址。','Enlace copiado. Use la URL HTTPS publicada para imprimir el QR o programar NFC.','Produktlink kopiert. Verwenden Sie die veröffentlichte HTTPS-URL für QR-Druck oder optionale NFC-Programmierung.'),
  'Copy is unavailable in this browser. Select the product URL shown below instead.': zhEsDe('此浏览器无法自动复制，请手动选择下方产品链接。','La copia no está disponible. Seleccione manualmente la URL del producto.','Kopieren ist in diesem Browser nicht verfügbar. Wählen Sie die Produkt-URL manuell aus.'),
  'QR generation is unavailable. The product URL remains available to copy.': zhEsDe('二维码生成不可用，仍可复制产品链接。','El QR no está disponible, pero puede copiar la URL del producto.','QR-Generierung nicht verfügbar. Die Produkt-URL kann weiterhin kopiert werden.'),
  'PRODUCT LOOKUP': zhEsDe('产品查询', 'BÚSQUEDA DE PRODUCTO', 'PRODUKTSUCHE'),
  'We couldn’t find that model.': zhEsDe('未找到该型号。','No encontramos ese modelo.','Dieses Modell wurde nicht gefunden.'),
  'The QR or NFC link may be incomplete, or the model may no longer be in this catalog.': zhEsDe('二维码或 NFC 链接可能不完整，或该型号已不在目录中。','El enlace QR o NFC puede estar incompleto, o el modelo ya no está en el catálogo.','Der QR- oder NFC-Link ist möglicherweise unvollständig oder das Modell nicht mehr im Katalog.'),
  'Hello. I can help you find a product, check catalog details, learn about the factory, or prepare an RFQ. What are you sourcing?': zhEsDe('您好。我可以帮您寻找产品、查询目录详情、了解工厂或准备询价。您想采购什么？','Hola. Puedo ayudarle a encontrar productos, consultar el catálogo, conocer la fábrica o preparar una RFQ. ¿Qué necesita comprar?','Hallo. Ich helfe bei der Produktsuche, Katalogdetails, Werksinformationen und RFQs. Was möchten Sie beschaffen?')
});


Object.assign(messages, {
  'Detailed specifications and commercial documents are available to qualified buyers through sales.': zhEsDe('详细规格和商务文件可由销售提供给符合要求的买家。','Las especificaciones y documentos comerciales están disponibles para compradores cualificados a través de ventas.','Detaillierte Spezifikationen und Handelsdokumente erhalten qualifizierte Käufer über den Vertrieb.'),
  'A high-back mesh silhouette with 4D adjustable armrests and a bold color finish.': zhEsDe('高背网椅轮廓，配备 4D 可调扶手和醒目配色。','Silueta de malla con respaldo alto, brazos 4D y un acabado de color audaz.','Hohe Netzlehne mit 4D-Armlehnen und markanter Farbausführung.'),
  'A clean mesh-back design in blue, ready for material and color customization.': zhEsDe('简洁蓝色网背设计，可定制材料和颜色。','Diseño limpio de respaldo de malla azul, personalizable en materiales y colores.','Klares blaues Netzrückendesign, individuell bei Material und Farbe.'),
  'A versatile mesh chair with a confident red finish for retail and private-label collections.': zhEsDe('百搭网椅，红色饰面醒目，适合零售和自有品牌系列。','Silla de malla versátil en rojo, ideal para minoristas y marcas privadas.','Vielseitiger Netzstuhl in kräftigem Rot für Handel und Private Labels.'),
  'An adjustable mesh office chair in grey, suited to broad commercial seating programs.': zhEsDe('灰色可调节办公网椅，适合广泛商业座椅项目。','Silla de oficina de malla gris ajustable, adecuada para programas comerciales.','Verstellbarer grauer Netz-Bürostuhl für vielseitige gewerbliche Programme.'),
  'A padded high-back executive chair in brown with a substantial, premium silhouette.': zhEsDe('棕色软包高背主管椅，造型宽厚，质感高端。','Silla ejecutiva marrón acolchada con respaldo alto y silueta premium.','Gepolsterter brauner Chefsessel mit hoher Lehne und hochwertiger Silhouette.'),
  'A padded ergonomic executive chair in black, designed for a refined office collection.': zhEsDe('黑色软包人体工学主管椅，适合精致办公系列。','Silla ejecutiva ergonómica negra acolchada para una colección de oficina refinada.','Schwarzer ergonomischer Chefsessel mit Polsterung für hochwertige Bürokollektionen.'),
  'A red high-back mesh office chair with adjustable headrest and lumbar support, fixed nylon arms, and a single-lock butterfly tilt mechanism.': zhEsDe('红色高背办公网椅，头枕腰托可调，固定尼龙扶手，单锁定蝴蝶倾仰机构。','Silla roja de malla con respaldo alto, cabecero y lumbar ajustables, brazos fijos de nailon y mecanismo butterfly de bloqueo único.','Roter Netz-Bürostuhl mit hoher Lehne, verstellbarer Kopf- und Lordosenstütze, festen Nylonarmlehnen und Butterfly-Mechanik mit Einzelarretierung.'),
  'A high-back mesh office chair with fixed nylon arms, a single-lock butterfly tilt mechanism, and nylon-base mobility.': zhEsDe('高背办公网椅，固定尼龙扶手，单锁定蝴蝶倾仰机构，尼龙椅脚移动顺畅。','Silla de malla con respaldo alto, brazos fijos de nailon, mecanismo butterfly de bloqueo único y base de nailon.','Netz-Bürostuhl mit hoher Lehne, festen Nylonarmlehnen, Butterfly-Mechanik mit Einzelarretierung und Nylonbasis.'),
  'A grey nylon-frame visitor chair with breathable mesh, adjustable lumbar support, fixed nylon arms, and a powder-coated metal frame.': zhEsDe('灰色尼龙框访客椅，透气网面、可调腰托、固定尼龙扶手和粉末喷涂金属框架。','Silla de visita gris con estructura de nailon, malla transpirable, lumbar ajustable, brazos fijos y marco metálico pintado.','Grauer Besucherstuhl mit Nylongestell, atmungsaktivem Netz, verstellbarer Lordosenstütze, festen Armlehnen und pulverbeschichtetem Metallrahmen.'),
  'A mesh student chair with a foam seat, footrest, and adjustable-height base, presented here in blue.': zhEsDe('学生学习网椅，泡棉座垫、脚踏和高度可调底座，图示为蓝色。','Silla de estudio de malla con asiento de espuma, reposapiés y base ajustable, aquí en azul.','Netz-Lernstuhl mit Schaumstoffsitz, Fußstütze und höhenverstellbarer Basis, hier in Blau.'),
  'A pink mesh student chair with a foam seat, footrest, and adjustable-height base for coordinated study ranges.': zhEsDe('粉色学生学习网椅，泡棉座垫、脚踏和高度可调底座，适合配套学习椅系列。','Silla de estudio rosa de malla con espuma, reposapiés y base ajustable para colecciones coordinadas.','Rosa Netz-Lernstuhl mit Schaumstoffsitz, Fußstütze und höhenverstellbarer Basis für abgestimmte Serien.'),
  'An economical student chair with mesh surfaces, a foam seat, foldable nylon arms, and a compact nylon base.': zhEsDe('经济型学生椅，网面靠背座面、泡棉座垫、折叠尼龙扶手和紧凑尼龙底座。','Silla de estudio económica con malla, asiento de espuma, brazos plegables de nailon y base compacta.','Wirtschaftlicher Lernstuhl mit Netz, Schaumstoffsitz, klappbaren Nylonarmlehnen und kompakter Nylonbasis.'),
  'A mid-back task chair with a PU surface, foldable and rotatable 2D nylon arms, and a simple height-adjustment mechanism.': zhEsDe('中背职员椅，PU 表面，2D 尼龙扶手可折叠旋转，高度调节机构简洁。','Silla de trabajo de respaldo medio con PU, brazos 2D plegables y giratorios y ajuste sencillo de altura.','Arbeitsstuhl mit mittlerer Lehne, PU-Oberfläche, klappbaren und drehbaren 2D-Nylonarmlehnen und einfacher Höhenverstellung.'),
  'An all-foam compressed sofa with high-density new foam, breathable fabric, modular possibilities, and four metal support frames.': zhEsDe('全泡棉压缩沙发，采用高密度新泡棉和透气面料，支持模块化组合，配四个金属支撑架。','Sofá comprimido de espuma con espuma nueva de alta densidad, tela transpirable, opciones modulares y cuatro soportes metálicos.','Komprimiertes Vollschaumsofa mit neuem hochdichtem Schaumstoff, atmungsaktivem Bezug, modularen Optionen und vier Metallstützrahmen.'),
  'A curved all-foam sofa with high-density new foam, breathable fabric, modular possibilities, and compressed packing.': zhEsDe('弧形全泡棉沙发，高密度新泡棉、透气面料、模块化组合和压缩包装。','Sofá curvo de espuma con espuma nueva de alta densidad, tela transpirable, opciones modulares y embalaje comprimido.','Geschwungenes Vollschaumsofa mit neuem hochdichtem Schaumstoff, atmungsaktivem Bezug, modularen Optionen und Kompressionsverpackung.'),
  'A one-seat all-foam compressed sofa with high-density new foam, breathable fabric, and no assembly requirement.': zhEsDe('单人全泡棉压缩沙发，高密度新泡棉和透气面料，无需组装。','Sofá individual comprimido de espuma con espuma nueva de alta densidad, tela transpirable y sin montaje.','Komprimiertes Vollschaumsofa für eine Person mit neuem hochdichtem Schaumstoff, atmungsaktivem Bezug und ohne Montage.'),
  'A convertible all-foam design with high-density new foam, breathable fabric, modular possibilities, and compressed packing.': zhEsDe('可转换全泡棉设计，高密度新泡棉、透气面料、模块化组合和压缩包装。','Diseño convertible de espuma con espuma nueva de alta densidad, tela transpirable, opciones modulares y embalaje comprimido.','Wandelbares Vollschaumdesign mit neuem hochdichtem Schaumstoff, atmungsaktivem Bezug, modularen Optionen und Kompressionsverpackung.')
});


Object.assign(messages, {
  'Share this product': zhEsDe('分享此产品', 'Compartir este producto', 'Dieses Produkt teilen'),
  'Concept preview only — your inquiry has not been sent. A local lead draft was saved for the employee inbox in this browser.': zhEsDe('仅为概念预览——您的询价尚未发送。本地询价草稿已保存在此浏览器的员工收件箱中。', 'Solo vista previa: su consulta no se ha enviado. Se guardó un borrador local en la bandeja de empleados de este navegador.', 'Nur eine Konzeptvorschau – Ihre Anfrage wurde nicht gesendet. Ein lokaler Entwurf wurde im Mitarbeiter-Posteingang dieses Browsers gespeichert.'),
  'Concept preview only — your inquiry has not been sent. Browser storage is unavailable, so no local lead draft could be saved.': zhEsDe('仅为概念预览——您的询价尚未发送。浏览器存储不可用，因此无法保存本地询价草稿。', 'Solo vista previa: su consulta no se ha enviado. El almacenamiento no está disponible y no se pudo guardar un borrador local.', 'Nur eine Konzeptvorschau – Ihre Anfrage wurde nicht gesendet. Der Browserspeicher ist nicht verfügbar; es konnte kein lokaler Entwurf gespeichert werden.')
});
Object.assign(ui.en, { 'share.aria': 'Share {model} on {channel}' });
Object.assign(ui.zh, { 'share.aria': '在{channel}分享 {model}' });
Object.assign(ui.es, { 'share.aria': 'Compartir {model} en {channel}' });
Object.assign(ui.de, { 'share.aria': '{model} auf {channel} teilen' });


Object.assign(messages, {
  'Social': zhEsDe('社交动态', 'Social', 'Social'),
  'THE ZJ SEATING SOCIAL EDIT': zhEsDe('ZJ SEATING 社交精选', 'LA EDICIÓN SOCIAL DE ZJ SEATING', 'DIE ZJ SEATING SOCIAL-AUSWAHL'),
  'Seating,': zhEsDe('座椅，', 'Asientos,', 'Sitzmöbel,'),
  'in the feed.': zhEsDe('尽在动态。', 'en el feed.', 'im Feed.'),
  'Product stories, factory moments, and design details for international buyers—visible in one place.': zhEsDe('为国际买家集中呈现产品故事、工厂动态和设计细节。', 'Historias de productos, momentos de fábrica y detalles de diseño para compradores internacionales, visibles en un solo lugar.', 'Produktgeschichten, Werksmomente und Designdetails für internationale Einkäufer – an einem Ort sichtbar.'),
  'Explore the latest posts': zhEsDe('浏览最新动态', 'Explorar las últimas publicaciones', 'Neueste Beiträge entdecken'),
  'PUBLIC CONTENT PREVIEW': zhEsDe('公开内容预览', 'VISTA PREVIA DE CONTENIDO PÚBLICO', 'ÖFFENTLICHE INHALTSVORSCHAU'),
  'Approved website content is shown directly here. This is not a live social feed or a claim of posts on official accounts.': zhEsDe('此处直接展示已批准的网站内容，并非实时社交动态，也不代表官方账号已发布这些内容。', 'El contenido aprobado del sitio se muestra directamente aquí. No es un feed social en vivo ni implica publicaciones en cuentas oficiales.', 'Freigegebene Website-Inhalte werden hier direkt angezeigt. Dies ist kein Live-Feed und keine Behauptung von Veröffentlichungen auf offiziellen Konten.'),
  'DIRECT FROM THE COLLECTION': zhEsDe('直接来自产品系列', 'DIRECTAMENTE DE LA COLECCIÓN', 'DIREKT AUS DER KOLLEKTION'),
  'Follow the collection.': zhEsDe('关注产品系列。', 'Siga la colección.', 'Entdecken Sie die Kollektion.'),
  'Filter by channel, open a featured model, or share a story with your team.': zhEsDe('按渠道筛选、打开精选型号，或与团队分享内容。', 'Filtre por canal, abra un modelo destacado o comparta una historia con su equipo.', 'Filtern Sie nach Kanal, öffnen Sie ein Modell oder teilen Sie einen Beitrag mit Ihrem Team.'),
  'All posts': zhEsDe('全部动态', 'Todas las publicaciones', 'Alle Beiträge'),
  'Product focus': zhEsDe('产品聚焦', 'Enfoque de producto', 'Produktfokus'),
  'Factory story': zhEsDe('工厂故事', 'Historia de fábrica', 'Werkgeschichte'),
  'Design preview': zhEsDe('设计预览', 'Vista previa de diseño', 'Designvorschau'),
  'Culture story': zhEsDe('企业文化故事', 'Historia de cultura', 'Kulturgeschichte'),
  'View model': zhEsDe('查看型号', 'Ver modelo', 'Modell ansehen'),
  'View factory': zhEsDe('了解工厂', 'Ver fábrica', 'Werk ansehen'),
  'View culture': zhEsDe('了解企业文化', 'Ver cultura', 'Kultur ansehen'),
  'Share post': zhEsDe('分享动态', 'Compartir publicación', 'Beitrag teilen'),
  'Share this post': zhEsDe('分享此动态', 'Compartir esta publicación', 'Diesen Beitrag teilen'),
  'Copy post link': zhEsDe('复制动态链接', 'Copiar enlace de publicación', 'Beitragslink kopieren'),
  'Post link copied.': zhEsDe('动态链接已复制。', 'Enlace de publicación copiado.', 'Beitragslink kopiert.'),
  'Copy unavailable. Use the page URL instead.': zhEsDe('无法复制，请使用页面网址。', 'Copia no disponible. Use la URL de la página.', 'Kopieren nicht verfügbar. Verwenden Sie die Seiten-URL.'),
  'FROM THE FEED TO YOUR PROJECT': zhEsDe('从动态到您的项目', 'DEL FEED A SU PROYECTO', 'VOM FEED ZU IHREM PROJEKT'),
  'Let’s talk about your next collection.': zhEsDe('聊聊您的下一个产品系列。', 'Hablemos de su próxima colección.', 'Sprechen wir über Ihre nächste Kollektion.'),
  'Bring a model, a reference, or a new product brief. We’ll help shape the next step.': zhEsDe('提供型号、参考产品或新产品需求，我们将协助您推进下一步。', 'Aporte un modelo, una referencia o un nuevo brief. Le ayudaremos a definir el siguiente paso.', 'Bringen Sie ein Modell, eine Referenz oder ein neues Briefing mit. Wir gestalten den nächsten Schritt.'),
  'Start an RFQ': zhEsDe('开始询价', 'Iniciar una RFQ', 'RFQ starten'),
  'Social media page concept': zhEsDe('社交媒体页面概念', 'Concepto de página de redes sociales', 'Social-Media-Seitenkonzept'),
  'Filter social posts': zhEsDe('筛选社交动态', 'Filtrar publicaciones sociales', 'Social-Beiträge filtern'),
  'A confident color story for modern office collections.': zhEsDe('为现代办公系列带来自信配色。', 'Una historia de color segura para colecciones de oficina modernas.', 'Eine selbstbewusste Farbgeschichte für moderne Bürokollektionen.'),
  'A closer look at 8387H-RD: a compact high-back profile, adjustable support, and a finish that gives private-label collections a confident point of view.': zhEsDe('近距离了解 8387H-RD：紧凑高背造型、可调节支撑和醒目饰面，为自有品牌系列带来鲜明特色。', 'Una mirada al 8387H-RD: perfil compacto de respaldo alto, soporte ajustable y un acabado que da personalidad a las marcas privadas.', '8387H-RD im Detail: kompakte hohe Lehne, verstellbare Unterstützung und eine Ausführung mit klarer Handschrift für Private Labels.'),
  'Curved comfort, made for modern living.': zhEsDe('弧形舒适设计，为现代生活而生。', 'Comodidad curva para la vida moderna.', 'Geschwungener Komfort für modernes Wohnen.'),
  'YKX-33016 pairs a sculptural silhouette with an all-foam compressed format—a relaxed statement for coordinated lifestyle ranges.': zhEsDe('YKX-33016 将雕塑感轮廓与全泡棉压缩结构结合，为配套生活方式系列带来轻松亮点。', 'YKX-33016 combina una silueta escultural con un formato comprimido de espuma para colecciones lifestyle coordinadas.', 'YKX-33016 verbindet skulpturale Form mit komprimiertem Vollschaumformat für abgestimmte Lifestyle-Serien.'),
  'See the process behind the product.': zhEsDe('了解产品背后的流程。', 'Conozca el proceso detrás del producto.', 'Entdecken Sie den Prozess hinter dem Produkt.'),
  'From product development to export packing, organized checkpoints help turn an approved seating specification into a repeatable order.': zhEsDe('从产品开发到出口包装，有序检查点帮助将获批座椅规格转化为可重复的订单。', 'Del desarrollo al embalaje de exportación, los controles organizados convierten una especificación aprobada en un pedido repetible.', 'Von der Entwicklung bis zur Exportverpackung machen klare Kontrollpunkte aus einer freigegebenen Spezifikation einen wiederholbaren Auftrag.'),
  'ZJ Seating production and quality process': zhEsDe('ZJ Seating 生产与质量流程', 'Proceso de producción y calidad de ZJ Seating', 'Produktions- und Qualitätsprozess von ZJ Seating'),
  'A limited first look at 9628H.': zhEsDe('限量首次预览 9628H。', 'Una primera vista limitada de 9628H.', 'Ein erster begrenzter Blick auf 9628H.'),
  'Explore the refined high-back silhouette of our next premium executive direction. Detailed design and engineering information remains available through a controlled buyer review.': zhEsDe('探索下一代高端主管椅的精致高背轮廓。详细设计与工程信息仍需通过受控买家审核获取。', 'Explore la refinada silueta de respaldo alto de nuestra próxima línea ejecutiva premium. Los detalles técnicos requieren una revisión controlada del comprador.', 'Entdecken Sie die hochlehnige Silhouette unserer nächsten Premium-Chefsesselrichtung. Technische Details erhalten Sie nach kontrollierter Käuferprüfung.'),
  'Compact comfort with a practical footrest.': zhEsDe('紧凑舒适，配有实用脚踏。', 'Comodidad compacta con reposapiés práctico.', 'Kompakter Komfort mit praktischer Fußstütze.'),
  'A closer look at 8422MJ-BL for coordinated study ranges, with a supportive integrated footrest and a fresh blue finish.': zhEsDe('近距离了解 8422MJ-BL，一体式支撑脚踏和清新蓝色饰面，适合配套学习椅系列。', 'Una mirada al 8422MJ-BL para colecciones de estudio coordinadas, con reposapiés integrado y acabado azul.', '8422MJ-BL für abgestimmte Lernstuhlserien, mit integrierter Fußstütze und frischer blauer Ausführung.'),
  'Better seating starts with shared standards.': zhEsDe('更好的座椅始于共同标准。', 'Mejores asientos comienzan con normas compartidas.', 'Bessere Sitzmöbel beginnen mit gemeinsamen Standards.'),
  'Quality, innovation, and cooperation shape the way our team approaches product thinking, manufacturing, and everyday collaboration.': zhEsDe('品质、创新和协作塑造团队在产品思考、制造和日常合作中的方式。', 'Calidad, innovación y cooperación guían el diseño, la fabricación y la colaboración diaria de nuestro equipo.', 'Qualität, Innovation und Zusammenarbeit prägen Produktdenken, Fertigung und tägliche Zusammenarbeit unseres Teams.'),
  'ZJ Seating team and manufacturing culture': zhEsDe('ZJ Seating 团队与制造文化', 'Equipo y cultura de fabricación de ZJ Seating', 'Team und Fertigungskultur von ZJ Seating')
});
Object.assign(ui.en, { 'social.count': '{count} posts' });
Object.assign(ui.zh, { 'social.count': '{count} 条动态' });
Object.assign(ui.es, { 'social.count': '{count} publicaciones' });
Object.assign(ui.de, { 'social.count': '{count} Beiträge' });

Object.assign(messages, {
  'mesh chairs': zhEsDe('网椅', 'sillas de malla', 'Netzstühle'),
  'executive chairs': zhEsDe('行政椅', 'sillas ejecutivas', 'Chefsessel'),
  'visitor chairs': zhEsDe('访客椅', 'sillas de visita', 'Besucherstühle'),
  'study chairs': zhEsDe('学习椅', 'sillas de estudio', 'Lernstühle'),
  'task chairs': zhEsDe('办公椅', 'sillas operativas', 'Bürostühle'),
  'compressed sofas': zhEsDe('压缩沙发', 'sofás comprimidos', 'Kompressionssofas'),
  'all products': zhEsDe('全部产品', 'todos los productos', 'alle Produkte'),
  'About us': zhEsDe('关于我们', 'Nosotros', 'Über uns'),
  'ABOUT ZJ SEATING': zhEsDe('关于 ZJ SEATING', 'ACERCA DE ZJ SEATING', 'ÜBER ZJ SEATING'),
  'People behind the partnership.': zhEsDe('合作伙伴背后的团队。', 'Las personas detrás de la colaboración.', 'Die Menschen hinter der Partnerschaft.'),
  'One team from first brief to repeat order.': zhEsDe('从首次需求到重复订单，同一团队全程支持。', 'Un equipo desde el primer brief hasta la repetición del pedido.', 'Ein Team vom ersten Briefing bis zur Folgebestellung.'),
  'ZJ Seating brings product development, manufacturing, quality, and export support into one sourcing partnership.': zhEsDe('ZJ Seating 将产品开发、制造、品质和出口支持整合为一体化采购合作。', 'ZJ Seating reúne desarrollo de producto, fabricación, calidad y apoyo a la exportación en una sola colaboración de suministro.', 'ZJ Seating verbindet Produktentwicklung, Fertigung, Qualität und Exportunterstützung in einer Beschaffungspartnerschaft.'),
  'Buyers work with clear points of contact across commercial decisions, product details, compliance documents, and delivery coordination.': zhEsDe('买家可通过明确的联系人推进商务决策、产品细节、合规文件和交付协调。', 'Los compradores cuentan con contactos claros para decisiones comerciales, detalles de producto, documentos de cumplimiento y coordinación de entregas.', 'Einkäufer erhalten klare Ansprechpartner für Geschäftsentscheidungen, Produktdetails, Compliance-Unterlagen und Lieferkoordination.'),
  'Meet the project team.': zhEsDe('认识项目团队。', 'Conozca al equipo del proyecto.', 'Lernen Sie das Projektteam kennen.'),
  'Placeholder profiles for this concept. Final names and roles will come from ZJ Seating.': zhEsDe('以下为本概念网站的占位人物资料，最终姓名与职责将由 ZJ Seating 提供。', 'Perfiles provisionales de este concepto. Los nombres y funciones definitivos los proporcionará ZJ Seating.', 'Platzhalterprofile für dieses Konzept. Endgültige Namen und Rollen liefert ZJ Seating.'),
  'Export Sales Director': zhEsDe('出口销售总监', 'Director de Ventas de Exportación', 'Exportverkaufsleiter'),
  'Overseas market strategy, key accounts, and commercial negotiations.': zhEsDe('负责海外市场战略、重点客户和商务谈判。', 'Estrategia de mercados internacionales, cuentas clave y negociaciones comerciales.', 'Internationale Marktstrategie, Schlüsselkunden und Geschäftsverhandlungen.'),
  'International Account Manager': zhEsDe('国际客户经理', 'Gerente Internacional de Cuentas', 'Internationale Kundenbetreuerin'),
  'Buyer communication, samples, order coordination, and after-sales follow-up.': zhEsDe('负责买家沟通、样品、订单协调和售后跟进。', 'Comunicación con compradores, muestras, coordinación de pedidos y seguimiento posventa.', 'Käuferkommunikation, Muster, Auftragskoordination und After-Sales-Betreuung.'),
  'Product Development Manager': zhEsDe('产品开发经理', 'Gerente de Desarrollo de Producto', 'Produktentwicklungsleiter'),
  'OEM/ODM briefs, product engineering, materials, and sampling.': zhEsDe('负责 OEM/ODM 需求、产品工程、材料和打样。', 'Briefs OEM/ODM, ingeniería de producto, materiales y muestras.', 'OEM-/ODM-Briefings, Produkttechnik, Materialien und Musterung.'),
  'Quality & Compliance Lead': zhEsDe('品质与合规负责人', 'Responsable de Calidad y Cumplimiento', 'Leiterin Qualität & Compliance'),
  'Quality checkpoints, test documentation, and market-specific compliance support.': zhEsDe('负责质量检查点、测试文件和特定市场合规支持。', 'Controles de calidad, documentación de pruebas y apoyo de cumplimiento por mercado.', 'Qualitätskontrollpunkte, Prüfunterlagen und marktspezifische Compliance-Unterstützung.')
});
Object.assign(messages, {
  'Directory': zhEsDe('团队目录', 'Directorio', 'Verzeichnis'),
  'Contact export sales': zhEsDe('联系出口销售', 'Contactar ventas de exportación', 'Exportvertrieb kontaktieren'),
  'Contact account support': zhEsDe('联系客户支持', 'Contactar soporte de cuentas', 'Kundenbetreuung kontaktieren'),
  'Discuss product development': zhEsDe('洽谈产品开发', 'Consultar desarrollo de producto', 'Produktentwicklung besprechen'),
  'Client account': zhEsDe('客户账户', 'Cuenta de cliente', 'Kundenkonto'),
  'Employee access': zhEsDe('员工入口', 'Acceso de empleados', 'Mitarbeiterzugang'),
  'Manager approvals': zhEsDe('经理审批', 'Aprobaciones de gerencia', 'Manager-Genehmigungen')
});
