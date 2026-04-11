function camelCaseToWords(s: string) {
    const result = s.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
}
function shallowEqual(a, b) {
  if (a === b) return true;

  if (
    typeof a !== 'object' || a === null ||
    typeof b !== 'object' || b === null
  ) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (a[key] !== b[key] || !Object.hasOwn(b, key)) {
      return false;
    }
  }

  return true;
}

// there's better json schema form generators but the weight and difficulty of bending them to my way of thinking isn't worth not
// writing 200 lines of code
// todo: htmlFor/id fields are not guaranteed unique
export function drawProps(obj, prefix, onchange, data) {
    let result = [];
    const labelClass = 'col-form-label col-sm-2';
    const controlClass = 'col-sm-6';

    for (const i in obj) {
        if (Object.hasOwn(obj, i)) {
            if (obj[i].inputType) {
                switch (obj[i].inputType) {
                    case "text":
                        result.push(<div key={i} className="form-group row"><label className={labelClass} htmlFor={i}>{camelCaseToWords(i)}</label>
                            <div className={controlClass}><input className="form-control" data-field={i} type="text" id={i} onChange={onchange} defaultValue={data[i]}></input></div></div>);
                        break;
                    case "number":
                        result.push(<div key={i} className="form-group row"><label className={labelClass} htmlFor={i}>{camelCaseToWords(i)}</label>
                            <div className={controlClass}><input className="form-control" data-field={i} type="number" id={i} onChange={onchange} defaultValue={data[i]}></input></div></div>);
                        break;
                    case "checkbox":
                        result.push(<div key={i} className="form-group row">
                            <div className={labelClass}>Choose</div>
                            <div className={`col-form-label ` + controlClass}><div className={`form-check`}><input className="form-check-input" data-field={i} type="checkbox" id={i} onChange={onchange} checked={!!data[i]}></input><label className="form-check-label" htmlFor={i}>{camelCaseToWords(i)}</label>
                            </div></div></div>);
                        break;
                    case "date":
                        result.push(<div key={i} className="form-group row"><label className={labelClass} htmlFor={i}>{camelCaseToWords(i)}</label>
                            <div className={controlClass}><input className="form-control" data-field={i} type="date" id={i} onChange={onchange} defaultValue={data[i]}></input></div></div>);
                        break;
                    case "file":
                        result.push(<div key={i} className="form-group row"><label className={labelClass} htmlFor={i}>{camelCaseToWords(i)}</label>
                            <div className={controlClass}><input className="form-control" data-field={i} type="file" id={i} onChange={onchange} defaultValue={data[i]}></input></div></div>);
                        break;
                    case "select":

                        // i think this is getting out of hand
                        let options =[];
                        if(obj[i].mapFields){
                            options = obj[i].anyOf.map((option, j)=>{return {const: j, title: option[obj[i].mapFields.title]}});
                        }else{
                            options = obj[i].anyOf;
                        }

                        let defaultValue;
                        if(data[i])
                            obj[i].anyOf.forEach((element: object, j: number) => {
                                console.log(element, j);
                                if(shallowEqual(element, data[i])){
                                    defaultValue = j;
                                }
                            });

                        try{
                            result.push(<div key={i} className="form-group row"><label className={labelClass} htmlFor={i}>{camelCaseToWords(i)}</label>
                                <div className={controlClass}><select className="form-control" data-field={i} id={i} onChange={onchange} defaultValue={defaultValue}>
                                <option value="">Please choose</option>
                                {Object.keys(options).map((j) => (
                                    <option key={options[j]['const']} value={options[j]['const']}>{options[j]['title']}</option>
                                ))}
                                </select></div></div>);
                        }catch(ex){
                            console.warn(`error parsing options ${i}`, ex);
                        }
                        break;
                    case "hidden":
                        result.push(<input key={i} className="form-control" data-field={i} type="text" id={i} onChange={onchange}></input>);
                        break;
                    case "default":
                        result.push(<div>{`Input type for ${i} not handled: ${obj[i].inputType}`}</div>);
                        break;
                }
            } else {
                result.push(<div key={i} className="form-group">{camelCaseToWords(i)}: no inputType specified for {i}</div>);
            }
        }
    }
    return result;
}