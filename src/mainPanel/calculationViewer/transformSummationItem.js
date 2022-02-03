// this code copied and modified from //definitionViewer/transformRootDomain.js.
// has glitch when i=0, j=2!!!!!!
// use conditional breakpoints at line 96.
export default rootDomain => {
    const lang = 'Unlabelled'
    const labelRole = 'Default'
    const grid = []
    const rootDomainName = rootDomain.Label.Default.Unlabelled
    const maxRow =
        rootDomain.ContributingConcepts.length +
        rootDomain.ContextualMemberGrid.length +
        1
    const maxCol = rootDomain.PeriodHeaders.length + 2
    for (let i = 0; i < maxRow; i++) {
        const row = []
        if (i < rootDomain.ContextualMemberGrid.length + 1) {
            // the length of contextualmembergrid is the number of axes. we want a row for each axis.
            for (let j = 0; j < maxCol; j++) {
                if (j === 0) {
                    row.push('')
                } else if (j === 1) {
                    if (i === 0) {
                        row.push(rootDomainName)
                    } else {
                        const voidCell = rootDomain.VoidQuadrant[i - 1]
                        if (voidCell.TypedDomain) {
                            if (voidCell.TypedDomain.Label[labelRole]) {
                                const langVal =
                                    voidCell.TypedDomain.Label[labelRole][lang]
                                const unlabelledVal =
                                    voidCell.TypedDomain.Label.Default
                                        .Unlabelled
                                row.push(langVal || unlabelledVal)
                            } else {
                                row.push(
                                    voidCell.TypedDomain.Label.Default
                                        .Unlabelled
                                )
                            }
                        } else {
                            if (voidCell.Dimension.Label[labelRole]) {
                                const langVal =
                                    voidCell.Dimension.Label[labelRole][lang]
                                const unlabelledVal =
                                    voidCell.Dimension.Label.Default.Unlabelled
                                row.push(langVal || unlabelledVal)
                            } else {
                                row.push(
                                    voidCell.Dimension.Label.Default.Unlabelled
                                )
                            }
                        }
                    }
                } else {
                    if (i === 0) {
                        const ph = rootDomain.PeriodHeaders[j - 2]
                        row.push(ph[lang] || ph.Unlabelled)
                    } else {
                        const memberCell =
                            rootDomain.ContextualMemberGrid[i - 1][j - 2]
                        if (memberCell.TypedMember) {
                            row.push(memberCell.TypedMember)
                        } else if (memberCell.ExplicitMember) {
                            if (memberCell.ExplicitMember.Label[labelRole]) {
                                const explicitMember = memberCell.ExplicitMember
                                const langVal =
                                    explicitMember.Label[labelRole][lang]
                                const unlabelledVal =
                                    explicitMember.Label.Default.Unlabelled
                                row.push(langVal || unlabelledVal)
                            } else {
                                row.push(
                                    memberCell.ExplicitMember.Label.Default
                                        .Unlabelled
                                )
                            }
                        } else {
                            row.push('')
                        }
                    }
                }
            }
        } else {
            const index = i - rootDomain.ContextualMemberGrid.length - 1
            for (let j = 0; j < maxCol; j++) {
                if (j === 0) {
                    row.push('filllllller')
                } else if (j === 1) {
                    const il = rootDomain.ContributingConcepts[index]
                    if (il.Label[labelRole]) {
                        row.push(
                            il.Label[labelRole][lang] ||
                                il.Label.Default.Unlabelled
                        )
                    } else {
                        row.push(il.Label.Default.Unlabelled)
                    }
                } else {
                    const fact = rootDomain.FactualQuadrant[index][j - 2]
                    if (fact.Unlabelled.Core) {
                        if (fact[lang]) {
                            row.push(
                                fact[lang].Head +
                                    fact[lang].Core +
                                    fact[lang].Tail
                            )
                        } else {
                            row.push(
                                fact.Unlabelled.Head +
                                    fact.Unlabelled.Core +
                                    fact.Unlabelled.Tail
                            )
                        }
                    } else {
                        row.push(fact.Unlabelled.CharData)
                    }
                }
            }
        }
        grid.push(row)
    }
    return grid
}
