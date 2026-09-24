const fs = require('fs');

// 1. Update src/app/(dashboard)/outreach/page.tsx
let outreachCode = fs.readFileSync('src/app/(dashboard)/outreach/page.tsx', 'utf8');

// Add Phone import
if (!outreachCode.includes('Phone,')) {
  outreachCode = outreachCode.replace(
    '  Mail,\n  Send,',
    '  Mail,\n  Phone,\n  Send,'
  );
}

// Add Phone to CSV export
if (!outreachCode.includes("'Recipient Phone'")) {
  outreachCode = outreachCode.replace(
    "      'Recipient Email',\n      'Property Address',",
    "      'Recipient Email',\n      'Recipient Phone',\n      'Property Address',"
  );

  outreachCode = outreachCode.replace(
    "`\"${p.recipientEmail}\"`,",
    "`\"${p.recipientEmail}\"`,\n      `\"${p.phone || ''}\"`,"
  );
}

// Update table row to show phone
const targetOwner = `<div className="text-gray-400 text-[10px] mt-0.5">{p.recipientEmail}</div>`;
const replacementOwner = `<div className="text-gray-500 text-[11px] mt-1 flex items-center gap-2 flex-wrap">
                        <span className="text-gray-700 font-medium">{p.recipientEmail}</span>
                        {p.phone && (
                          <>
                            <span className="text-gray-300">•</span>
                            <a
                              href={'tel:' + p.phone}
                              className="text-emerald-700 font-semibold font-mono text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50 flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="h-2.5 w-2.5" />
                              {p.phone}
                            </a>
                          </>
                        )}
                      </div>`;

if (outreachCode.includes(targetOwner)) {
  outreachCode = outreachCode.replace(targetOwner, replacementOwner);
}

// Update drawer header to show homeowner name and phone
const targetHeader = `<div className="text-[11px] text-[#a3b899]">
                    Property: {activeEmail.qualification.address}
                  </div>`;
const replacementHeader = `<div className="text-[11px] text-[#a3b899] flex items-center gap-2 flex-wrap">
                    <span>Owner: <strong className="text-white">{activeEmail.recipientName}</strong></span>
                    <span>•</span>
                    <span>{activeEmail.recipientEmail}</span>
                    {properties.find(p => p.leadId === reviewLeadId)?.phone && (
                      <>
                        <span>•</span>
                        <a 
                          href={'tel:' + properties.find(p => p.leadId === reviewLeadId)?.phone}
                          className="text-emerald-300 underline font-mono flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          {properties.find(p => p.leadId === reviewLeadId)?.phone}
                        </a>
                      </>
                    )}
                  </div>`;

if (outreachCode.includes(targetHeader)) {
  outreachCode = outreachCode.replace(targetHeader, replacementHeader);
}

fs.writeFileSync('src/app/(dashboard)/outreach/page.tsx', outreachCode, 'utf8');
console.log('Updated outreach/page.tsx successfully');

// 2. Update src/components/LeadsTable.tsx
let leadsTableCode = fs.readFileSync('src/components/LeadsTable.tsx', 'utf8');

const targetLeadEmail = `<div className="text-xs text-gray-400">{lead.email}</div>`;
const replacementLeadEmail = `<div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-gray-600">{lead.email}</span>
                            {lead.phone && (
                              <>
                                <span className="text-gray-300">•</span>
                                <a 
                                  href={'tel:' + lead.phone}
                                  className="text-emerald-700 font-mono text-[11px] font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Phone className="h-2.5 w-2.5" />
                                  {lead.phone}
                                </a>
                              </>
                            )}
                          </div>`;

if (leadsTableCode.includes(targetLeadEmail)) {
  leadsTableCode = leadsTableCode.replace(targetLeadEmail, replacementLeadEmail);
  fs.writeFileSync('src/components/LeadsTable.tsx', leadsTableCode, 'utf8');
  console.log('Updated LeadsTable.tsx successfully');
}
