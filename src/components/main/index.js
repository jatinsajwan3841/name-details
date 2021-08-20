import React from 'react'
import './index.scss'

const Main = () => {
    const [gender, setGender] = React.useState('')
    const [age, setAge] = React.useState('')
    const [nationality, setNationality] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const [found, setFound] = React.useState(0)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const name = e.target.name.value
        await setFound(0)
        if (name.split(' ').length > 1) {
            alert('Why did you do that? please enter first name only!')
            return
        } else if (name === '') {
            alert('Why did you do that? please enter the first name!')
            return
        } else {
            let gen = await fetch(`https://api.genderize.io?name=${name}`)
            gen = await gen.json()
            if (gen.gender !== null) setGender(gen)
            else setFound((prev) => prev + 1)
            let age = await fetch(`https://api.agify.io?name=${name}`)
            age = await age.json()
            if (age.age !== null) setAge(age)
            else setFound((prev) => prev + 1)
            let nationality = await fetch(
                `https://api.nationalize.io?name=${name}`,
            )
            nationality = await nationality.json()
            if (nationality.country.length === 0) {
                setNationality(['oops! could not guess!', ''])
                setFound((prev) => prev + 1)
            } else {
                let regionNames = await new Intl.DisplayNames(['en'], {
                    type: 'region',
                })
                setNationality([
                    regionNames.of(nationality.country[0]?.country_id),
                    nationality.country[0]?.country_id,
                ])
            }
        }
    }
    const handleReset = () => {
        setNationality('')
        setAge('')
        setGender('')
        setFound(0)
    }
    return (
        <div className="container">
            <p className="head">
                Wanna guess the Age, Gender and nationality of a name? <br />
                Fill up the first name below...
            </p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="first name"
                    minLength="3"
                    className="name"
                    required
                />
                <br />
                <input
                    type="submit"
                    value="let's go!"
                    className="button submit"
                />
                <input
                    type="reset"
                    value="reset"
                    className="button"
                    onClick={handleReset}
                />
            </form>
            <div className="output">
                {found === 3 ? (
                    <> Sorry could not guess, is it even a name? </>
                ) : (
                    <>
                        {' '}
                        {gender !== '' && (
                            <div>
                                Hello {gender.name}! <br />I guess you are a{' '}
                                {gender.gender}
                                {gender.gender === 'male' ? (
                                    <span> &#9794;</span>
                                ) : (
                                    <span> &#9792;</span>
                                )}
                                .
                            </div>
                        )}
                        {age !== '' && <div>umm maybe {age.age} years old</div>}
                        {nationality !== '' && (
                            <div>
                                and probably from {nationality[0]}{' '}
                                {nationality[1] !== '' && (
                                    <img
                                        src={`https://www.countryflags.io/${nationality[1]}/flat/32.png`}
                                        alt={nationality[0]}
                                        height="32px"
                                        width="32px"
                                        className="flag"
                                    />
                                )}
                            </div>
                        )}
                        <div className="source" onClick={() => setOpen(true)}>
                            Api sources ?
                        </div>
                    </>
                )}
            </div>
            {open && (
                <div className="details" onClick={() => setOpen(false)}>
                    <div className="apis">
                        Api sources used: <br />
                        <a href="https://nationalize.io/">
                            https://nationalize.io/
                        </a>
                        <br />
                        <a href="https://genderize.io/">
                            https://genderize.io/
                        </a>
                        <br />
                        <a href="https://agify.io/">https://agify.io/</a>
                        <br />
                        <a href="https://nationalize.io/">
                            https://www.countryflags.io/
                        </a>
                        <br />
                        Image credits :{' '}
                        <a href="https://unsplash.com/photos/UcBkRilVFVs">
                            @ Geran de Klerk
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Main
