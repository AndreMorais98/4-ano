function create(
  ssk12pass,
  keyType,
  keySize,
  sn_uid,
  sn_e,
  sn_cn,
  sn_ou3,
  sn_ou2,
  sn_ou1,
  sn_ou,
  sn_o,
  sn_c,
  r_name,
  r_email,
  r_phone
) {
  return `{"Attributes":{"Attribute":[]},"ProfileID":"caServerKeygen_UserCert","Renewal":false,"Input":[{"id":"i1","ClassID":"serverKeygenInputImpl","Name":"Server-Side Key Generation","Text":null,"Attribute":[{"name":"serverSideKeygenP12Passwd","Value":"${ssk12pass}","Descriptor":{"Syntax":"server_side_keygen_request_type","Constraint":null,"Description":"Server-Side Key Generation P12 Password","DefaultValue":null}},{"name":"keyType","Value":"${keyType}","Descriptor":{"Syntax":"server_side_keygen_key_type","Constraint":null,"Description":"Server-Side Key Generation Key Type","DefaultValue":null}},{"name":"keySize","Value":"${keySize}","Descriptor":{"Syntax":"server_side_keygen_key_size","Constraint":null,"Description":"Server-Side Key Generation Key Size","DefaultValue":null}}],"ConfigAttribute":[]},{"id":"i2","ClassID":"subjectNameInputImpl","Name":"Subject Name","Text":null,"Attribute":[{"name":"sn_uid","Value":"${sn_uid}","Descriptor":{"Syntax":"string","Constraint":null,"Description":"UID","DefaultValue":null}},{"name":"sn_e","Value":"${sn_e}","Descriptor":{"Syntax":"string","Constraint":null,"Description":"Email","DefaultValue":null}},{"name":"sn_cn","Value":"${sn_cn}","Descriptor":{"Syntax":"string","Constraint":null,"Description":"Common Name","DefaultValue":null}},{"name":"sn_ou3","Value":"${sn_ou3}","Descriptor":{"Syntax":"string","Constraint":null,"Description":"Organizational Unit 3","DefaultValue":null}},{"name":"sn_ou2","Value":"${sn_ou2}","Descriptor":{"Syntax":"string","Constraint":null,"Description":"Organizational Unit 2","DefaultValue":null}},{"name":"sn_ou1","Value":"${sn_ou1}","Descriptor":{"Syntax":"string","Constraint":null,"Description":"Organizational Unit 1","DefaultValue":null}},{"name":"sn_ou","Value":"${sn_ou}","Descriptor":{"Syntax":"string","Constraint":null,"Description":"Organizational Unit","DefaultValue":null}},{"name":"sn_o","Value":"${sn_o}","Descriptor":{"Syntax":"string","Constraint":null,"Description":"Organization","DefaultValue":null}},{"name":"sn_c","Value":"${sn_c}","Descriptor":{"Syntax":"string","Constraint":null,"Description":"Country","DefaultValue":null}}],"ConfigAttribute":[]},{"id":"i3","ClassID":"submitterInfoInputImpl","Name":"Requestor Information","Text":null,"Attribute":[{"name":"requestor_name","Value":"${r_name}","Descriptor":{"Syntax":"string","Constraint":null,"Description":"Requestor Name","DefaultValue":null}},{"name":"requestor_email","Value":"${r_email}","Descriptor":{"Syntax":"string","Constraint":null,"Description":"Requestor Email","DefaultValue":null}},{"name":"requestor_phone","Value":"${r_phone}","Descriptor":{"Syntax":"string","Constraint":null,"Description":"Requestor Phone","DefaultValue":null}}],"ConfigAttribute":[]}]}`;
}

exports.create = create;
